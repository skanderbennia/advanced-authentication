import Sequelize from "sequelize";
import choosenConfig from "../config.js";

import User from "./User.js";
import UserVerification from "./UserVerification.js";
import RefreshToken from "./RefreshToken.js";

const config = choosenConfig[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize);
db.UserVerfication = UserVerification(sequelize);
db.RefreshToken = RefreshToken(sequelize);

export default db;
