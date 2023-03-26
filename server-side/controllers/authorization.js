import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import redisClient from "../redis_connect.js";
import queryString from "querystring";
export default function authorization(req, res, next) {
  const authHeader = req.headers["authorization"];
  const cookies = req.headers.cookie;
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
    if (err) {
      const cookie = queryString.parse(cookies, ";");
      if (!cookie.refreshToken) {
        return res.sendStatus(403);
      }
      const redisRefreshToken = await redisClient.get(accessToken);
      if (cookie.refreshToken != redisRefreshToken) {
        return res.sendStatus(403);
      } else {
        await redisClient.del(accessToken);
        next();
      }
    } else {
      next();
    }
  });
}
