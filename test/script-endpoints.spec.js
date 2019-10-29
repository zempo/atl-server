const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");

describe(`Protected Endpoints can reject unauthorized users`, () => {
  let db;

  const { testUsers, testScripts } = helpers.makeAppFixtures();

  before("Instantiate knex", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));
});
