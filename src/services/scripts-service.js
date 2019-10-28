const xss = require("xss");
const Treeize = require("treeize");
const { isWebUri } = require("valid-url");

// title_page TEXT NOT NULL,
// body TEXT NOT NULL,
// actors TEXT [],
// tags TEXT [] DEFAULT ARRAY['Int', 'Ext', 'Description', 'Line-break']::text[],
// date_created TIMESTAMP DEFAULT now() NOT NULL,
// date_updated TIMESTAMP

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
        "s.date_modified",
        ...userFields
      )
      .leftJoin("users AS usr", "s.user_id", "usr.id")
      .where({
        "usr.id": user_id
      })
      .groupBy("s.id", "usr.id");
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.date_created AS user:date_created",
  "usr.date_modified AS user:date_modified"
];

module.exports = ScriptsService;
