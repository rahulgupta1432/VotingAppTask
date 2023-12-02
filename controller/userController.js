let userModel = require("../model/userModel");

async function createUser(req, res) {
  let user = await userModel.registerVote(req.body).catch((error) => {
    return { error };
  });
  if (!user || (user && user.error)) {
    let error = user && user.error ? user.error : "Internal Issue";
    return res.send({ error });
  }
  // return res.send({ data: user.data });
  return res.redirect("/login?msg=RegisterSuccessully");
}
async function createUserUI(req, res) {
  return res.render("register.ejs");
}
async function loginUser(req, res) {
  let user = await userModel.loginVote(req.body).catch((error) => {
    return { error };
  });
  if (!user || (user && user.error)) {
    let error = user && user.error ? user.error : "Internal Issue";
    return res.redirect(`/login?msg=${error}`);
    // return res.render("login")
  }
  console.log("this is session id", req.session.id);
  console.log("user id", user.id);
  req.session.userId = user.id;

  if (user.user) {
    return res.redirect("/vote?msg=success");
  }
  return res.redirect("/admin?msg=welcome");
}
async function loginUI(req, res) {
  return res.render("login.ejs");
}

async function logoutUser(req, res) {
  let user = await userModel.logoutVote(req.session.userId).catch((error) => {
    return { error };
  });
  if (!user || (user && user.error)) {
    let error = user && user.error ? user.error : "Internal Issue";
    return res.send({ error });
  }
  req.session.userId = null;
  return res.redirect("/login");
}
// hard-coded Admin
async function adminLogin(req, res) {
  let admin = {
    email: req.body.email,
    password: req.body.password,
    role: "sub-admin",
  };
  if (admin.role == "admin" || admin.role != "sub-admin") {
    return res.send({ error: "You are no longer to admin" });
  }
  if (req.body.admin.role != "admin" || admin.role != "sub-admin") {
    return res.send({ error: "You are no longer to admin" });
  }
  if (req.body.admin.email != req.body.email) {
    return res.send({ error: `Admin Email Id not found...Please try again` });
  }
  if (req.body.admin.password != req.body.password) {
    return res.send({ error: `The given Admin Password Is incorrect` });
  }
  // return res.send({ data: "Login Successfully Admin" });
  return res.redirect("/admin");
}
async function adminLoginUI(req, res) {
  return res.render("adminLogin.ejs");
}

async function viewDetails(req, res) {
  let user = await userModel.details(req.query).catch((error) => {
    return { error };
  });
  if (!user || (user && user.error)) {
    let error = user && user.error ? user.error : "Internal";
    return res.send({ error });
  }
  // return res.render("/admin");
  return res.send({ data: user.data });
}
async function viewOne(req, res) {
  let findOne = await userModel.detailsOne(req.params.name).catch((error) => {
    console.log(req.body);
    return { error };
  });
  console.log("id", req.params.id);
  if (!findOne || (findOne && findOne.error)) {
    let error = findOne && findOne.error ? findOne.error : "Internal Issue";
    // return res.send({ error });
    return res.render("admin.ejs");
  }
  return res.render("view.ejs", { data: findOne.data });
  // return res.send({ data: findOne.data });
}
async function search_user(req, res) {
  let search = await userModel.searchDetails(req.body.name).catch((error) => {
    return { error };
  });
  if (!search || (search && search.error)) {
    let error = search && search.error ? search.error : "Internal Issue";
    return res.send({ error });
  }
  // return res.render("admin.ejs");
  return res.send({ data: search.data });
}
async function showAllUser(req, res) {
  let user = await userModel.showAll(req.query).catch((error) => {
    return { error };
  });
  console.log("user", user.error);
  if (!user || (user && user.error)) {
    let error = user && user.error ? user.error : "Internal Issue";
    return res.redirect(`/admin/users?msg=${error}`);
  }
  return res.render("admin_user/admin.users.ejs", {
    // return res.send({
    data: user.data,
    total: user.total,
    page: user.page,
    limit: user.limit,
  });
  //   data: user.data,
  //   total: user.total,
  //   page: user.page,
  //   limit: user.limit,
  // });
  // return res.send({ data: user.data });
}
async function updateUserInfo(req, res) {
  let user = await userModel.updateUserDetails(req.params.id, req.body);
  console.log("req.body", user.error);
  if (!user || (user && user.error)) {
    const url =
      user && user.data && user.data.id
        ? "/admin/users/" + user.data.id
        : "/admin/users";
    return res.redirect(url);
  }
  const url =
    user && user.data && user.data.id
      ? "/admin/users/" + user.data.id
      : "/admin/users";
  // return res.send({ user: user.data });
  return res.redirect("/admin/users");
}
async function updateUserInfoUI(req, res) {
  let user = await userModel.findByIdOne(req.params.id);
  if (!user || (user && user.error)) {
    let url =
      user && user.data && user.data.id
        ? "/admin/users/" + user.data.id
        : "/admin/users";
    return res.redirect(url);
  }
  return res.render("admin_user/admin_user.update.ejs", { user: user.data });
}
async function deleteUser() {}
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  createUserUI,
  loginUI,
  adminLogin,
  adminLoginUI,
  viewDetails,
  viewOne,
  search_user,
  showAllUser,
  updateUserInfo,
  updateUserInfoUI,
};
