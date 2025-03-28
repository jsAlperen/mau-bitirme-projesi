require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "this.alperen",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.mongourl,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);

app.use(express.static("assets"));

app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.get("/", (req, res, next) => {
  res.render("index", {
    test: "mau",
  });
});
app.get("/hesap-idealkilo", (req, res, next) => {
  res.render("hesap-idealkilo", {
    test: "Deneme",
  });
});
app.get("/hesap-gunluksu", (req, res, next) => {
  res.render("hesap-su", {
    test: "Deneme",
  });
});
app.get("/hesap-vucutyag", (req, res, next) => {
  res.render("hesap-yag", {
    test: "Deneme",
  });
});
app.get("/hesap-kalori", (req, res, next) => {
  res.render("hesap-kalori", {
    test: "Deneme",
  });
});
app.get("/hesap-kitle", (req, res, next) => {
  res.render("hesap-kitle", {
    test: "Deneme",
  });
});
app.get("/hesap-bazal", (req, res, next) => {
  res.render("hesap-bazal", {
    test: "Deneme",
  });
});
app.listen(process.env.PORT, function () {
  console.log("Hazır: " + process.env.PORT);
});
