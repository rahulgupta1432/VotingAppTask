const { seqeulizeCon, QueryTypes } = require("../init/dbConfig");
const security = require("../helper/security");

function auth(permission) {
  return async (req, res, next) => {
    let token = req.session.token;
    if (typeof token != "string") {
      return res.redirect("/login?msg=unAuthorized");
    }
    let decrypt = await security.decrypt(token, "Its_Mine").catch((error) => {
      return { error };
    });
    if (!token || (token && token.error)) {
      return { error: token.error };
    }
    let Query = `select user.id,user.name,p.name as permission
    from user
    left join userpermission as up
    on user.id=up.user_id
    left join permission as p
    on up.permission_id=p.id
    where user.id='${decrypt.id}' and token='${token}'`;
    let user = await seqeulizeCon
      .query(Query, { type: QueryTypes.SELECT })
      .catch((error) => {
        return { error };
      });
    if (!user || (user && user.error)) {
      return res.redirect("/login?user.error");
    }
    let permissions = {};
    for (const i of user) {
      if (i.permission) {
        permissions[i.permission] = true;
      }
      if (permissions.length <= 0 || permissions[permission]) {
        return res.redirect("/login?msg=unauthorized");
      }
      req["userData"] = {
        name: user[0].name,
        id: user[0].id,
        permissions,
      };
      console.log(req.userData);
      next();
    }
  };
}
module.exports = { auth };
