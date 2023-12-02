let voteModel = require("../model/voteModel");
const { Vote } = require("../schema/vote");

async function createVoteUser(req, res) {
  // console.log("session", req.session.userId);
  let vote = await voteModel
    .registerVote(req.body, req.session.userId)
    .catch((error) => {
      return { error };
    });
  if (!vote || (vote && vote.error)) {
    let error = vote && vote.error ? vote.error : "Internal Issue";
    return res.redirect(`/login?msg=${error}`);
  }
  console.log(vote);
  // return res.send({ data: vote.data });
  return res.redirect("/vote?msg=Vote.Done");
}

async function voteUI(req, res) {
  return res.render("vote.ejs");
}

async function countVoteUser(req, res) {
  console.log("req", req.body);
  let vote = await voteModel.voteCount(req.query).catch((error) => {
    return { error };
  });
  console.log(vote, "1");
  if (!vote || (vote && vote.error)) {
    let error = vote && vote.error ? vote.error : "Internal Issue";
    return res.send({ error });
  }
  res.render("admin.ejs", { vote: vote.data });
}

module.exports = { createVoteUser, voteUI, countVoteUser };
