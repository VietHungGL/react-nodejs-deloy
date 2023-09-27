const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const cors = require("cors");

var authRouter = require("./routes/auth/router");
// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
const productsRouter = require("./routes/product/router");
const categoriesRouter = require("./routes/categories/router");
const suppliersRouter = require("./routes/supplier/router");
const customersRouter = require("./routes/customer/router");
const employeesRouter = require("./routes/employees/router");
const odersRouter = require("./routes/order/router");
const questionsRouter = require("./routes/questions/router");

const { CONNECTION_STRING, DB_NAME } = require("./constants/db");

const {
  passportVerifyToken, // USING
  passportVerifyAccount,
  passportConfigBasic,
} = require("./middlewares/passport");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);
// mongoose.connect("mongodb://localhost:27017/node-32-databases");
// mongoose.connect("mongodb://127.0.0.1:27017/node-32-database");
mongoose.connect(
  "mongodb+srv://hunggl1202:ozSE3vs8xzW5KH0X@cluster0.iknzw2x.mongodb.net/node-32-database"
);

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

// app.use('/products', passport.authenticate('jwt', { session: false }), productRouter);
app.use("/auth", authRouter);
// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use(
  "/products",
  passport.authenticate("jwt", { session: false }),
  productsRouter
);
app.use(
  "/categories",
  passport.authenticate("jwt", { session: false }),
  categoriesRouter
);
app.use(
  "/suppliers",
  passport.authenticate("jwt", { session: false }),
  suppliersRouter
);
app.use(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  customersRouter
);
app.use(
  "/employees",
  passport.authenticate("jwt", { session: false }),
  employeesRouter
);
app.use(
  "/oders",
  passport.authenticate("jwt", { session: false }),
  odersRouter
);
app.use(
  "/questions",
  passport.authenticate("jwt", { session: false }),
  questionsRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
