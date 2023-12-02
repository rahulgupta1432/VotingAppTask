let { sequelizeCon, Model, DataTypes } = require("../init/dbConfig");
class User extends Model {}
// sequelizeCon.sync({ alter: true });
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    tableName: "user",
    modelName: "User",
    sequelize: sequelizeCon,
  }
);

module.exports = { User };
