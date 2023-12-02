let express = require("express");
let app = express();
let config = require("config");
let port = config.get("port");
let { route } = require("./routes");
let session = require("express-session");
// const ejsLint = require("ejs-lint");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "#*@123",
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(route);
app.listen(port, () => {
  console.log("server is running on ", port);
});
