let { Sequelize, Model, DataTypes, QueryTypes, Op } = require("sequelize");
let sequelizeCon = new Sequelize("mysql://root:root@localhost:3308/votingapp");
// sequelizeCon.sync({ alter: true });
sequelizeCon
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch(() => {
    console.log("Unable to connect DB");
  });
module.exports = {
  sequelizeCon,
  Model,
  DataTypes,
  QueryTypes,
  Op,
};
