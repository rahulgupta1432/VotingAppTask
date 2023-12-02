let { Vote } = require("../schema/vote");
let joi = require("joi");
const { sequelizeCon } = require("../init/dbConfig");
const { QueryTypes } = require("sequelize");
async function registerVoteValidation(param) {
  let schema = joi.object({
    name: joi.string().required(),
  });
  let valid = await schema.validateAsync(param).catch((error) => {
    return { error };
  });
  console.log(valid);
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function registerVote(params, userID) {
  let valid = await registerVoteValidation(params).catch((error) => {
    return { error };
  });
  // console.log("valid");
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findUser = await Vote.findOne({ where: { voted_by: userID } }).catch(
    (error) => {
      return { error };
    }
  );
  if (findUser) {
    return { error: "already voted" };
  }
  if (findUser && findUser.error) {
    return { error: "user is not found" };
  }
  let voteData = {
    name: params.name,
    voted_by: userID,
  };
  let data = await Vote.create(voteData).catch((error) => {
    return { error };
  });
  if (!data || (data && data.error)) {
    return { error: "vote is not count" };
  }
  return { data: data };
}
async function voteCount() {
  let query = `select name, count(voted_by) as vote  from vote
                group by name`;
  let data = await sequelizeCon
    .query(query, { type: QueryTypes.SELECT })
    .catch((err) => {
      return { error: err };
    });
  if (!data || (data && data.error)) {
    return { error: data.error };
  }
  return { data: data };
}
module.exports = { registerVote, voteCount };
