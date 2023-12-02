let { sequelizeCon, Model, DataTypes } = require("../init/dbConfig");
let { User } = require("../schema/user");
class Vote extends Model {}
// sequelizeCon.sync({alter:true})
// Vote.hasMany(Vote);
// User.belongsTo(User);
Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    voted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
    },
  },
  {
    tableName: "vote",
    modelName: "Vote",
    sequelize: sequelizeCon,
  }
);
module.exports = {
  Vote,
};
