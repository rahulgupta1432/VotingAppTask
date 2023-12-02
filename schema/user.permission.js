const { sequelizeCon, Model, DataTypes } = require("../init/dbConfig");
class UserPermission extends Model {}
UserPermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "userpermission",
    modelName: "UserPermission",
    sequelize: sequelizeCon,
  }
);
module.exports = { UserPermission };
