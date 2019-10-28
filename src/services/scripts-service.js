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
        return ScriptsService.getScriptById(db, script.user_id, script.id);
      });
  },
  deleteScript(db, id) {
    return db("scripts")
      .where({ id })
      .delete();
  },
  updateScript(db, id, newScriptFields) {
    return db("scripts")
      .where({ id })
      .update(newScriptFields);
  },
  correctUser(loggedInId, targetId) {
    const NO_ERRORS = null;
    if (loggedInId !== targetId) {
      return {
        error: `User does not match script.`
      };
    }
    return NO_ERRORS;
  },
  postValidator(script) {
    //
  },
  patchValidator(script) {
    //
  },
  serializeScripts(scripts) {
    return scripts.map(this.serializeScript);
  },
  serializeScript(script) {
    const scriptTree = new Treeize();

    const scriptData = scriptTree.grow([script]).getData()[0];

    return {
      id: scriptData.id,
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
