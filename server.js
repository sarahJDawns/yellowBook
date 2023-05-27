const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const cors = require("cors");
const mainRoutes = require("./routes/main");
const notesRoutes = require("./routes/notes");
const dashboardRoutes = require("./routes/dashboard");
const kanbanRoutes = require("./routes/kanban");
// const { ensureAuth } = require("./middleware/auth");
const setPageTitle = require("./middleware/pageTitle");
const PORT = process.env.PORT || 2121;

require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

connectDB();

app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(setPageTitle);

// app.use(function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//     res.locals.isAuthenticated = true;
//   } else {
//     res.locals.isAuthenticated = false;
//   }
//   next();
// });

app.use("/", mainRoutes);
app.use("/notes", notesRoutes);
app.use("/", dashboardRoutes);
app.use("/kanban", kanbanRoutes);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}, better go catch it!`);
});
