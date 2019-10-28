const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

const ScriptsService = require("../services/scripts-service");
const scriptsRouter = express.Router();
const jsonBodyParser = express.json();

scriptsRouter.get("/", (req, res) => {
  res.send("Above the Line");
});

module.exports = scriptsRouter;
