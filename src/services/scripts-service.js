const xss = require("xss");
const Treeize = require("treeize");
const { isWebUri } = require("valid-url");

const ScriptsService = {
  getUserScripts(db, user_id) {
    return db
      .from("scripts AS s")
      .select(
        "s.id",
        "s.title",
        "s.author",
        "s.subtitle",
        "s.body",
        "s.actors",
        "s.tags",
        "s.date_created",
        "s.date_updated",
        ...userFields
      )
      .leftJoin("users AS usr", "s.user_id", "usr.id")
      .where({
        "usr.id": user_id
      })
      .groupBy("s.id", "usr.id");
  },
  getScriptById(db, user_id, script_id) {
    return db
      .from("scripts AS s")
      .select(
        "s.id",
        "s.title",
        "s.author",
        "s.subtitle",
        "s.body",
        "s.actors",
        "s.tags",
        "s.date_created",
        "s.date_updated",
        ...userFields
      )
      .leftJoin("users AS usr", "s.user_id", "usr.id")
      .where({
        "s.id": script_id,
        "usr.id": user_id
      })
      .groupBy("s.id", "usr.id");
  },
  insertScript(db, newScript) {
    return db
      .insert(newScript)
      .into("scripts")
      .returning("*")
      .then((script) => {
        return ScriptsService.getScriptById(db, script[0].user_id, script[0].id);
      });
  },
  deleteScript(db, id) {
    return db("scripts")
      .where({ "scripts.id": id })
      .delete();
  },
  updateScript(db, id, newScriptFields) {
    return db("scripts")
      .where({ "scripts.id": id })
      .update(newScriptFields);
  },
  correctUser(loggedInId, targetId) {
    const NO_ERRORS = null;
    if (loggedInId !== targetId) {
      return {
        error: `This resource does not belong to you. Make sure you are logged into the correct account.`
      };
    }
    return NO_ERRORS;
  },
  sanitizeTags(tags) {
    let sanitizedTags = [];
    tags.forEach((tag) => {
      let clean = xss(tag);
      sanitizedTags.push(clean);
    });
    return sanitizedTags;
  },
  postValidation(script) {
    // future validation
    const NO_ERRORS = null;

    return NO_ERRORS;
  },
  patchValidation(script) {
    // future validation
    const NO_ERRORS = null;

    return NO_ERRORS;
  },
  serializeScripts(scripts) {
    return scripts.map(this.serializeScript);
  },
  serializeScript(script) {
    const scriptTree = new Treeize();

    const scriptData = scriptTree.grow([script]).getData()[0];

    return {
      id: scriptData.id,
      date_created: scriptData.date_created,
      date_updated: scriptData.date_updated || null,
      title: xss(scriptData.title),
      author: xss(scriptData.author),
      subtitle: xss(scriptData.subtitle),
      body: xss(scriptData.body),
      actors: scriptData.actors,
      tags: scriptData.tags,
      user: scriptData.user || {}
    };
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.date_created AS user:date_created",
  "usr.date_updated AS user:date_updated"
];

module.exports = ScriptsService;
