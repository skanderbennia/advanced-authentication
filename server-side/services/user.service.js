import dotenv from "dotenv";
dotenv.config();
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jwtDecode from "jwt-decode";
import { Op } from "sequelize";
import sendMailValidateAccount from "../mailservice.js";
import sendMailForgetPassword from "../emailForgetPassword.js";
import uuid4 from "uuid4";
import redisClient from "../redis_connect.js";

function signAccessToken(expireIn) {
  return jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expireIn ? expireIn : process.env.ACCESS_TOKEN_EXPIRES
  });
}
function signRefreshToken() {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
}
function generateValidationString() {
  return jwt.sign({ payload: uuid4() + Date.now() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 60 * 5 });
}
function generateTokenForgetPassword(email) {
  return jwt.sign({ payload: uuid4() + Date.now(), email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 60 * 5 });
}

async function loginUser(email, password, remember) {
  const connectedUser = await db.User.findOne({ where: { email, authType: "simple" } });
  if (!connectedUser) {
    throw { statusCode: 400, message: "bad request" };
  }
  const verifyPassword = await bcrypt.compare(password, connectedUser.password);
  if (!verifyPassword) {
    throw { statusCode: 400, message: "bad request" };
  }
  const accessToken = signAccessToken(remember ? "7d" : null);
  const refreshToken = signRefreshToken();
  db.RefreshToken.create({ value: refreshToken });
  redisClient.set(accessToken, refreshToken);
  redisClient.expire(accessToken.toString(), 21600);
  return { refreshToken, accessToken };
}
async function registerUser(firstname, lastname, email, password) {
  const userCheck = await db.User.findOne({ where: { [Op.and]: [{ email }, { authType: "simple" }] } });
  if (userCheck) {
    throw { statusCode: 400, message: "bad request" };
  }
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await db.User.create({ firstname, lastname, email, password: passwordHash, authType: "simple" });
  const token = signAccessToken();
  const otp = generateValidationString();
  await db.UserVerfication.create({ userId: user.id, validationString: otp, expiresIn: Date.now() + 21600000 });
  await sendMailValidateAccount(email, otp);
  return { token };
}
async function googleAuthenticationService(token) {
  const decodedUser = jwtDecode(token);

  if (!decodedUser) {
    throw { statusCode: 400, message: "bad request" };
  }
  if (decodedUser && decodedUser.azp !== process.env.CLIENT_ID) {
    throw { statusCode: 400, message: "bad request" };
  }
  const checkUser = await db.User.findOne({
    where: { [Op.and]: [{ email: decodedUser.email }, { authType: "google" }] }
  });
  if (!checkUser) {
    user = await db.User.create({
      firstname: decodedUser.given_name,
      lastname: decodedUser.family_name,
      email: decodedUser.email,
      authType: "google"
    });
    const otp = generateValidationString();
    await db.UserVerfication.create({ userId: user.id, validationString: otp, expiresIn: Date.now() + 21600000 }); // plus 6 days
    await sendMailValidateAccount(decodedUser.email, otp);
    const refreshToken = signRefreshToken();
    const accessToken = signAccessToken();
    redisClient.set("refreshToken:" + refreshToken);
    db.RefreshToken.create({ value: refreshToken });
    return { accessToken, refreshToken };
  }
  const accessToken = signAccessToken();
  const refreshToken = signRefreshToken(checkUser.id);
  db.RefreshToken.create({ value: refreshToken });
  return { accessToken, refreshToken };
}

async function validateAccountService(token) {
  const userVerification = await db.UserVerfication.findOne({
    where: {
      validationString: {
        [Op.eq]: token
      },
      expiresIn: { [Op.gt]: Date.now() }
    }
  });
  if (!userVerification) {
    return { statusCode: 400, message: "invalid token !" };
  }
  await db.User.update(
    { verified: true },
    {
      where: {
        id: userVerification.userId
      }
    }
  );
  return { statusCode: 200, message: "valid token !" };
}
async function validateRefreshToken(refreshToken) {
  try {
    const filterRefreshToken = await db.RefreshToken.findOne({
      where: {
        value: { [Op.eq]: refreshToken }
      }
    });

    if (!filterRefreshToken) {
      throw { statusCode: 400, message: "Invalid refresh token !" };
    }

    return filterRefreshToken;
  } catch (err) {
    throw err;
  }
}
async function refreshAccessTokenService(refreshToken) {
  try {
    const filterRefreshToken = await validateRefreshToken(refreshToken);
    await jwt.decode(filterRefreshToken.value, process.env.REFRESH_TOKEN_SECRET);

    return signAccessToken();
  } catch (err) {
    throw { statusCode: 400, message: "refresh Token has expired !" };
  }
}
async function logoutService(refreshToken) {
  try {
    const filterRefreshToken = await validateRefreshToken(refreshToken);
    await db.RefreshToken.destroy({
      where: { id: { [Op.eq]: filterRefreshToken.id } }
    });
  } catch (err) {
    throw err;
  }
}
async function forgetPasswordService(email) {
  const findUser = await db.User.findOne({ where: { email: { [Op.eq]: email } } });
  if (!findUser) {
    throw { statusCode: 400, message: "Bad email" };
  }
  const otp = generateTokenForgetPassword(email);
  await sendMailForgetPassword(email, otp);
}

async function resetPasswordService(password, token) {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      throw { statusCode: 400, message: "Bad token" };
    }
  });
  const decodedUser = jwtDecode(token);
  const findUser = await db.User.findOne({ where: { email: { [Op.eq]: decodedUser.email } } });
  if (!findUser) {
    throw { statusCode: 400, message: "Bad token" };
  }
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = await bcrypt.hash(password, salt);
  await db.User.update(
    { password: passwordHash },
    {
      where: {
        id: findUser.id
      }
    }
  );
}

export default {
  googleAuthenticationService,
  loginUser,
  registerUser,
  validateAccountService,
  refreshAccessTokenService,
  logoutService,
  forgetPasswordService,
  resetPasswordService
};
