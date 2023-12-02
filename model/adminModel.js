const { User } = require("../schema/user");
const joi = require("joi");
const security = require("../helper/security");
async function loginValidation(param) {
  let schema = joi.object({
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["com"] } })
      .required(),
    password: joi.string().required(),
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

async function loginAdmin(params) {
  let valid = await loginValidation(params).catch((error) => {
    return { error };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findEmail = await User.findOne({ where: { email: params.email } }).catch(
    (error) => {
      return { error };
    }
  );
  if (!findEmail || (findEmail && findEmail.error)) {
    return { error: "Admin Email is not found in DB" };
  }
  let com_pwd = await security
    .compare(params.password, findEmail.password)
    .catch((error) => {
      return { error };
    });
  if (!com_pwd || (com_pwd && com_pwd.error)) {
    return { error: "Password is Incorrect" };
  }
  let token = await security
    .encrypt({ id: findEmail.id }, "Its_Mine")
    .catch((error) => {
      return { error };
    });
  if (!token || (token && token.error)) {
    return { error: "Id is not Encrypted by Id" };
  }
  let upTokenById = await User.update(
    { token: token },
    { where: { id: findEmail.id } }
  ).catch((error) => {
    return { error };
  });
  if (!upTokenById || (upTokenById && upTokenById.error)) {
    return { error: "Internal Issue" };
  }
  return { data: "Login Successfully", token: token, id: findEmail.id };
}
async function registerAdmin(params) {
  let valid = await loginValidation(params).catch((error) => {
    return { error };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }
  let findEmail = await User.findOne({ where: { email: params.email } }).catch(
    (error) => {
      return { error };
    }
  );
  if (findEmail || (findEmail && findEmail.error)) {
    return { error: "Email is Already Exist in DB" };
  }
  let hash_pwd = await security.hash(params.password).catch((error) => {
    return { error };
  });
  if (!hash_pwd || (hash_pwd && hash_pwd.error)) {
    return { error: "Internal Issue in Hashing" };
  }
  let adminData = {
    email: params.email,
    password: hash_pwd.data,
    name: "sub-admin",
    contact: "9967729871",
    role: "sub-admin",
  };
  let data = await User.create(adminData).catch((error) => {
    return { error };
  });
  console.log(data);
  if (!data || (data && data.error)) {
    return { error: "Sub-Admin not created" };
  }
  return { data: data };
}
async function logout(id) {
  let findId = await User.findOne({ where: { id } }).catch((error) => {
    return { error };
  });
  if (!findId || (findId && findId.error)) {
    return { error: "Id is not found" };
  }
  let UpLogById = await User.update(
    { token: "" },
    { where: { id: findId.id } }
  ).catch((error) => {
    return { error };
  });
  console.log("token", UpLogById);
  return { data: "Logout Successfully" };
}

module.exports = { loginAdmin, registerAdmin, logout };
