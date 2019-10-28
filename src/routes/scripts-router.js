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
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, author, subtitle, body, actors, tags } = req.body;
    const newScript = { title, author, subtitle, body, actors, tags };
    newScript.user_id = req.user.id;

    async function validateScript(script, service) {
      try {
        // const error = await service.postValidator(script);
        // if (error) return res.status(400).json(error);
        const insertedScript = await service.insertScript(req.app.get("db"), script);

        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${insertedScript[0]["id"]}`))
          .json(ScriptsService.serializeScript(insertedScript[0]));
      } catch (error) {
        next(error);
      }
    }

    const addScript = validateScript(newScript, ScriptsService);
    addScript;
  });

scriptsRouter
  .route("/:user_id/:script_id")
  .all(requireAuth)
  .all(checkForScript)
  .get((req, res) => {
    if (req.user.id === res.script[0]["user:id"]) {
      res.json(ScriptsService.serializeScripts(res.script));
    } else {
      res.status(403).end();
    }
  })
  .delete((req, res, next) => {
    if (req.user.id === res.script[0]["user:id"]) {
      ScriptsService.deleteScript(req.app.get("db"), req.params.script_id)
        .then((rowsAffected) => {
          res.status(204).end();
        })
        .catch(next);
    } else {
      res.status(403).end();
    }
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { title, author, subtitle, body, actors, tags } = req.body;
    const newScript = { title, author, subtitle, body, actors, tags };
    newScript.date_updated = new Date().toLocaleString();

    async function validateScript(script, service) {
      try {
        const wrongUser = await service.correctUser(req.user.id, res.script[0]["user:id"]);
        if (wrongUser) return res.status(403).json(wrongUser);

        const updatedScript = await service.updateScript(req.app.get("db"), req.params.script_id, script);
        if (!updatedScript) {
          return res.status(409).json({ error: "request timeout" });
        }

        return res.status(204).end();
      } catch (error) {
        next(error);
      }
    }

    const editScript = validateScript(newScript, ScriptsService);
    editScript;
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

async function checkForScript(req, res, next) {
  try {
    const script = await ScriptsService.getScriptById(req.app.get("db"), req.params.user_id, req.params.script_id);
    if (script.length === 0) return res.status(404).json({ error: "This script might have been moved or deleted." });

    res.script = script;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = scriptsRouter;
