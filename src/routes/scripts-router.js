const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

// setup
const ScriptsService = require("../services/scripts-service");
const scriptsRouter = express.Router();
const jsonBodyParser = express.json();

scriptsRouter
  .route("/:user_id")
  .all(requireAuth)
  .get(checkForScripts, (req, res) => {
    if (req.user.id === res.scripts[0]["user:id"]) {
      res.json(ScriptsService.serializeScripts(res.scripts));
    } else {
      res.status(403).end();
    }
  });

async function checkForScripts(req, res, next) {
  try {
    const scripts = await ScriptsService.getUserScripts(req.app.get("db"), req.params.user_id);
    if (scripts.length === 0) return res.status(404).json({ error: "This user has no scripts at the moment" });

    res.scripts = scripts;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = scriptsRouter;
