let { User } = require("../schema/user");
let joi = require("joi");
let security = require("../helper/security");
// const { Vote } = require("../schema/vote");
const { UserPermission } = require("../schema/user.permission");
const { sequelizeCon, QueryTypes, Op, DataTypes } = require("../init/dbConfig");
// here.
async function registerValidation(param) {
  let schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["org", "com"] } })
      .required(),
    phone: joi.string().required(),
  });
  let valid = await schema
    .validateAsync(param, { abortEarly: false })
    .catch((error) => {
      return { error };
    });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}
async function registerVote(params) {
  let valid = await registerValidation(params).catch((error) => {
    return { error };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findUser = await User.findOne({ where: { email: params.email } }).catch(
    (error) => {
      return { error };
    }
  );
  if (findUser || (findUser && findUser.error)) {
    return { error: "User is already Exist" };
  }
  let hash_pwd = await security.hash(params.password).catch((error) => {
    return { error };
  });
  if (!hash_pwd || (hash_pwd && hash_pwd.error)) {
    return { error: hash_pwd.error };
  }
  let userData = {
    name: params.username,
    password: hash_pwd.data,
    email: params.email,
    contact: params.phone,
  };
  let data = await User.create(userData).catch((error) => {
    return { error };
  });
  if (!data || (data && data.error)) {
    return { error: data.error };
  }
  let uPermission = {
    user_id: data.id,
    permission_id: 1,
  };
  let upPermission = await UserPermission.create(uPermission).catch((error) => {
    return { error };
  });
  if (!upPermission || (upPermission && upPermission.error)) {
    return { error: upPermission.error };
  }
  return { data: data };
}
async function loginValidation(param) {
  let schema = joi.object({
    password: joi.string().required(),
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["org", "com"] } })
      .required(),
  });
  let valid = await schema
    .validateAsync(param, { abortEarly: false })
    .catch((error) => {
      return { error };
    });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}

async function loginVote(param) {
  let valid = await loginValidation(param).catch((error) => {
    return { error };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }

  let findUser = await User.findOne({ where: { email: param.email } }).catch(
    (error) => {
      return { error };
    }
  );
  if (!findUser || (findUser && findUser.error)) {
    return { error: "User Email is not found in DB" };
  }
  let com_pwd = await security
    .compare(param.password, findUser.password)
    .catch((error) => {
      return { error };
    });
  // || com_pwd.error == false
  if (!com_pwd || (com_pwd && com_pwd.error)) {
    return { error: "Password is incorrect" };
  }

  let token = await security
    .encrypt({ id: findUser.id }, "Its_Mine")
    .catch((error) => {
      return { error };
    });
  // console.log(token);
  if (!token || (token && token.error)) {
    return { error: "Internal Issue in encryption" };
  }
  let upTokenById = await User.update(
    { token: token },
    { where: { id: findUser.id } }
  ).catch((error) => {
    return { error };
  });
  // console.log(upTokenById);
  if (!upTokenById || (upTokenById && upTokenById.error)) {
    return { error: upTokenById.error };
  }
  if (findUser.role != "admin" && findUser.role != "sub-admin") {
    return {
      data: "Login here Successfully",
      token: token,
      id: findUser.id,
      user: findUser,
    };
  }
  return {
    data: "Login here Successfully",
    token: token,
    id: findUser.id,
    admin: findUser,
  };
}

async function logoutVote(id) {
  let findUser = await User.findOne({ where: { id } }).catch((error) => {
    return { error };
  });
  if (!findUser || (findUser && findUser.error)) {
    return { error: "User is not found" };
  }
  let token = await User.update(
    { token: "" },
    { where: { id: findUser.id } }
  ).catch((error) => {
    return { error };
  });
  console.log("token", token);
  return { data: "Logout Successfully" };
}
async function details(id) {
  let find = await User.findByPk(id, {
    include: [{ model: User, attributes: ["option"] }],
  }).catch((error) => {
    return { error };
  });
  if (!find || (find && find.error)) {
    return { error: find.error };
  }
  return { data: find };
}
async function detailsOne(name) {
  let query = `select voted_by as id,user.name as username,user.email as email,role,contact,vote.name as member from user
              inner join vote on user.id = vote.voted_by
              where vote.name = '${name}'`;

  let data = await sequelizeCon
    .query(query, { type: QueryTypes.SELECT })
    .catch((err) => {
      return { error: err };
    });

  console.log(data);
  if (!data || (data && data.error)) {
    return { error: "Internal Issue" };
  }
  console.log(data);
  return { data: data };
}
async function showAll(params) {
  let limit = params.limit ? parseInt(params.limit) : 5;
  let page = params.page ? parseInt(params.page) : 1;
  let offset = (page - 1) * limit;
  let counter = await User.count();
  // let role = await User.findOne({ where: { role: "user" } });
  // where: { [Op.or]: [{ role: "user" }, { role: "sub-admin" }] },
  let data = await User.findAll({
    where: {
      [Op.or]: [{ role: "user" }],
    },
    limit,
    offset,
    raw: true,
  }).catch((error) => {
    return { error };
  });
  if (!data || (data && data.error)) {
    return { error: data.error };
  }
  return { data: data, total: counter, page, limit };
}
async function searchDetails(name) {
  let data = await User.findAll({
    where: {
      name: {
        [Op.like]: `${name}%`,
      },
    },
    attributes: ["id", "name", "email", "contact", "role", "password"],
  }).catch((error) => {
    return { error };
  });
  // attributes: ["name", "email", "contact", "role", "password"],
  // attribute is used to show those whose only show us
  if (!data || (data && data.error)) {
    return { error: "User is not found" };
  }
  return { data: data };
}

async function findByIdOne(id) {
  let data = await User.findOne({ where: { id: id } });
  if (!data || (data && data.error)) {
    return { error: "User is not found" };
  }
  return { data: data };
}
// update valid
async function updateValidation(param) {
  let schema = joi.object({
    name: joi.string(),
    password: joi.string(),
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["com"] } }),
    role: joi.string(),
    phone: joi.string(),
    token: joi.string(),
  });
  let valid = await schema
    .validateAsync(param, { abortEarly: false })
    .catch((error) => {
      return { error };
    });
  if (!valid || (valid && valid.error)) {
    let msg = [];
    for (let i of valid.error.details) {
      msg.push(i.message);
    }
    return { error: msg };
  }
  return { data: valid };
}
async function updateUserDetails(id, params) {
  // params.id = id;
  let valid = await updateValidation(params);
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findById = await User.findOne({ where: { id }, raw: true });
  if (!findById || (findById && findById.error)) {
    return { error: "User not found" };
  }
  (findById.name = params.name),
    (findById.email = params.email),
    (findById.contact = params.phone),
    (findById.role = params.role),
    (findById.password = params.password),
    console.log("1", findById.token);
  let updateUser = await User.update(findById, {
    where: { id },
  });
  if (!updateUser || (updateUser && updateUser.error)) {
    return { error: "User not Updated" };
  }
  return { data: findById };
}
async function deleteUserDetails(id) {
  let findById = await User.findOne({ where: { id } });
  if (!findById) {
    return { error: "User is not found" };
  }
  let data = await User.destroy({ where: { id } });
  return { error: data };
}

module.exports = {
  registerVote,
  loginVote,
  logoutVote,
  details,
  detailsOne,
  searchDetails,
  showAll,
  updateUserDetails,
  findByIdOne,
};
