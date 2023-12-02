const { sequelizeCon, Model, DataTypes } = require("../init/dbConfig");
class Permission extends Model {}
Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "permission",
    modelName: "Permission",
    sequelize: sequelizeCon,
  }
);
module.exports = { Permission };
