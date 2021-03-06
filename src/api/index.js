const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
 * Routes
 */
app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
app.use("/field", require("./routes/field"));
app.use("/event", require("./routes/event"));

// catch 404
app.use((req, res, next) => {
  res.status(404).send({ status: 404, error: "Not found" });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message;
  res.status(status).send({ status, error: msg });
});

module.exports = app;
