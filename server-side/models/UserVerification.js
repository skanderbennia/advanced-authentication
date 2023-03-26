import { DataTypes } from "sequelize";

export default function (sequelize) {
  const UserVerification = sequelize.define(
    "UserVerification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER
      },
      validationString: {
        type: DataTypes.STRING
      },
      expiresIn: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true
    }
  );
  return UserVerification;
}
