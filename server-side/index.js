import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import db from "./models/index.js";
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import redisClient from "./redis_connect.js";
const app = express();
app.use(express.json());

app.use(cors());

const port = 4000;

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
db.sequelize
  .sync()
  .then(() => {
    console.log("CONNECTED TO THE POSTGRES SERVER WITH PORT : " + process.env.POSTGRES_PORT);
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

app.listen(port, () => {
  console.log(`Your application is listening on port : ${port}`);
});
