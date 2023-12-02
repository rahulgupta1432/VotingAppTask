let adminModel = require("../model/adminModel");
async function createAdminUserUI(req, res) {
  return res.render("adminreg", {});
}
async function loginAdminUser(req, res) {
  let admin = await adminModel.loginAdmin(req.body).catch((error) => {
    return { error };
  });
  if (!admin || (admin && admin.error)) {
    let error = admin && admin.error ? admin.error : "Internal Issue";
    return res.send({ error });
  }
  req.session.adminId = admin.id;
  console.log("Admin Id", admin.id);
  console.log("session here", req.session.id);
  //   return res.header("token", admin.token).send({ data: admin.data });
  return res.redirect("/admin?msg=login");
}
async function loginAdminUserUI(req, res) {
  return res.render("adminLogin.ejs");
}
async function createAdminUser(req, res) {
  let admin = await adminModel.registerAdmin(req.body).catch((error) => {
    return { error };
  });
  if (!admin || (admin && admin.error)) {
    let error = admin && admin.error ? admin.error : "Internal Issue";
    return res.send({ error });
  }
  // return res.send({ data: admin.data });
  return res.redirect("/admin?msg=RegisterSuccessfully");
}
async function logoutAdminUser(req, res) {
  let admin = await adminModel.logout(req.session.adminId).catch((error) => {
    return { error };
  });
  console.log(admin);
  if (!admin || (admin && admin.error)) {
    let error = admin && admin.error ? admin.error : "Internal Issue";
    return res.send({ error });
  }
  req.session.adminId = null;
  return res.redirect("/adminlog");
  //   return res.send({ data: admin.data });
}
module.exports = {
  loginAdminUser,
  createAdminUser,
  createAdminUserUI,
  logoutAdminUser,
  loginAdminUserUI,
};
