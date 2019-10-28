require("dotenv").config();
//////////// IMPORTS ///////////////////
// const bearer = require("./middleware/bearer");
const express = require("express");
const errorCatch = require("./middleware/error");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./middleware/logger").logger;
const { NODE_ENV } = require("./config");
const winston = require("winston");
// ROUTE IMPORTS
const authRouter = require("./routes/auth-router");

//////////// APP ///////////////////
const app = express();
// make sure cors() is at the top
app.use(cors());

// MIDDLEWARE
const morganOption = NODE_ENV === "production" ? "tiny" : "dev";
if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

app.use(morgan(morganOption));
app.use(helmet());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/scripts", scriptsRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Above the Line");
});

app.use(errorCatch);

module.exports = app;
