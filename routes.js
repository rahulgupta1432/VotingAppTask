let express = require("express");
let route = express.Router();
let user = require("./controller/userController");
let vote = require("./controller/voteController");
let admin = require("./controller/adminController");
let authMid = require("./middlware/user.middle");
route.post("/user", user.createUser);
route.get("/user", user.createUserUI);
route.post("/login", user.loginUser);
route.get("/login", user.loginUI);
route.get("/logout", user.logoutUser);
route.post("/vote", vote.createVoteUser);
route.get("/vote", vote.voteUI);
route.get("/admin", vote.countVoteUser);
// hard coded
// route.get("/adminlog", user.adminLoginUI);
// route.post("/adminlog", user.adminLogin);
// session with another login panel
// route.post("/adminlog", admin.loginAdminUser);
// route.get("/adminlog", admin.loginAdminUserUI);
route.get("/admincr", admin.createAdminUserUI); //postman to create sub-admin
route.post("/admincr", admin.createAdminUser); //postman to create sub-admin
route.get("/logoutad", admin.logoutAdminUser);
route.get("/view", user.viewDetails);
route.get("/admin/viewOne/:name", user.viewOne);
route.get("/admin/search-user", user.search_user); //error
route.get("/admin/users", user.showAllUser);
route.post("/admin/users/:id", user.updateUserInfo);
route.get("/admin/users/:id", user.updateUserInfoUI);
// new high level api
const path = require("path");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
route.get("/admin/users/pdf", (req, res) => {
  // Assuming table.ejs is in the views directory
  console.log("body", req.body);
  return res.render("admin_user/admin.users.ejs");
});
module.exports = { route };
