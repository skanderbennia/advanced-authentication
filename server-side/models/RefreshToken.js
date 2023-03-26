import { DataTypes } from "sequelize";

export default function (sequelize) {
  const RefreshToken = sequelize.define("refreshTokens", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  return RefreshToken;
}
