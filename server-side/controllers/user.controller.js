import userService from "../services/user.service.js";
// Httponly authentication
const maxAgeHttpOnlyCookie = 24 * 60 * 60;
async function loginHttpOnly(req, res) {
  try {
    const { email, password } = req.body;

    const token = await userService.loginUser(email, password);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAgeHttpOnlyCookie });
    res.send({ message: "you are logged in" });
  } catch (err) {
    res.send(err);
  }
}
async function registerHttpOnly(req, res) {
  try {
    const { email, password, firstname, lastname } = req.body;
    const { token } = await userService.registerUser(firstname, lastname, email, password);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAgeHttpOnlyCookie });
    res.send({ message: "Account registration completed !" });
  } catch (err) {
    res.send(err);
  }
}
// Simple authentication
async function login(req, res) {
  try {
    const { email, password, remember } = req.body;
    const tokens = await userService.loginUser(email, password, remember);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_EXPIRES_COOKIES
    });
    res.send({ accessToken: tokens.accessToken });
  } catch (err) {
    res.status(400).send(err);
  }
}
async function googleAuthentication(req, res) {
  try {
    const { token } = req.body;
    const jwtTokens = await userService.googleAuthenticationService(token);
    res.send({ tokens: jwtTokens });
  } catch (err) {
    res.send({
      statusCode: 400,
      message: "bad request"
    });
  }
}
async function register(req, res) {
  try {
    const { email, password, firstname, lastname } = req.body;
    const { token } = await userService.registerUser(firstname, lastname, email, password);
    res.send({ token });
  } catch (err) {
    res.send(err);
  }
}
async function validateAccount(req, res) {
  const { token } = req.body;

  const response = await userService.validateAccountService(token);
  res.send(response);
}

async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;
    // i wil delete the token from the table of the refresh token only after verifying that the token is expired
    const accessToken = await userService.refreshAccessTokenService(refreshToken);
    res.status(200).send({ accessToken });
  } catch (err) {
    res.status(400).send(err);
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    await userService.logoutService(refreshToken);
    res.status(200).send({ message: "You are logged out !" });
  } catch (err) {
    res.status(400).send(err);
  }
}

async function forgetPassowrd(req, res) {
  try {
    const { email } = req.body;
    await userService.forgetPasswordService(email);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
}

async function resetPassword(req, res) {
  try {
    const { password, token } = req.body;
    await userService.resetPasswordService(password, token);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
}

export default {
  login,
  register,
  googleAuthentication,
  loginHttpOnly,
  registerHttpOnly,
  validateAccount,
  refreshAccessToken,
  logout,
  forgetPassowrd,
  resetPassword
};
