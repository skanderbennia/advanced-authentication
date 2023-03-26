import redis from "redis";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
redisClient.connect();
redisClient.on("connect", () => {
  console.log("CONNECTED TO THE REDIS SERVER WITH PORT:" + process.env.REDIS_PORT);
});
redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

export default redisClient;
