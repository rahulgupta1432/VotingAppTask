let security = require("bcrypt");
let jwt = require("jsonwebtoken");
async function hash(pt, salt = 10) {
  let pwd = await security.hash(pt, 10).catch((error) => {
    return { error };
  });
  if (!pwd || (pwd && pwd.error)) {
    return { error: pwd.error };
  }
  return { data: pwd };
}

async function compare(pt, encrypt) {
  let data = await security.compare(pt, encrypt).catch((error) => {
    return { error };
  });
  if (!data || (data && data.error)) {
    return { error: data.error ? data.error : true };
  }
  return { data: data };
}

function encrypt(key, token) {
  return new Promise((res, rej) => {
    jwt.sign(key, token, (err, data) => {
      if (err) {
        return rej(err);
      }
      return res(data);
    });
  });
}
function decrypt(key, token) {
  return new Promise((res, rej) => {
    jwt.verify(key, token, (err, data) => {
      if (err) {
        return rej(err);
      }
      return res(data);
    });
  });
}
module.exports = { hash, compare, encrypt, decrypt };
