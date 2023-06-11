var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var driverRouter = require("./routes/driver");
var vendorRouter = require("./routes/vendor");
var activeUserRouter = require("./routes/activateUser");
var deActiveUserRouter = require("./routes/deActivateUser");
var socketEmission = require("./routes/socketEmission");
var passengerTrip = require("./routes/passengerTrip");
var stores = require("./routes/store");
var activateStores = require("./routes/activateStore");

var app = express();

// Cron Job Scheduler
require("./utils/services/cronJob");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public/images/")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/drivers", driverRouter);
app.use("/vendors", vendorRouter);
app.use("/stores", stores);
app.use("/activate-store", activateStores);
app.use("/activate", activeUserRouter);
app.use("/de-activate", deActiveUserRouter);
app.use("/socket", socketEmission);
app.use("/trip", passengerTrip);

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
