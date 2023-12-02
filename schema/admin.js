const { sequelizeCon, Model, DataTypes } = require("../init/dbConfig");
class Admin extends Model {}
// sequelizeCon.sync({ alter: true });
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "admin",
    modelName: "Admin",
    sequelize: sequelizeCon,
  }
);
module.exports = { Admin };
