const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");

describe(`Admin Endpoints and Users`, () => {
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

  describe(`GET all users at api/users/`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given the user isn't an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 403 for non-admin user`, () => {
        return supertest(app)
          .get(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(403);
      });
    });

    context(`Given the user is an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      let expectedUsers = testUsers.map((user) => {
        return helpers.makeExpectedUser(user);
      });

      it(`Responds with a 200 and all users`, () => {
        return supertest(app)
          .get(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedUsers);
      });
    });
  });

  describe(`GET a specific user at api/users/`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given the user isn't an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 403 for non-admin user`, () => {
        return supertest(app)
          .get(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(403);
      });
    });

    context(`Given the user is an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      let userToQuery = 4;
      let expectedUser = helpers.makeExpectedUser(testUsers[userToQuery - 1]);

      it(`Responds with a 200 and user data`, () => {
        return supertest(app)
          .get(`/api/users/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedUser);
      });
    });
  });

  describe(`DELETE a specific user at api/users/:user_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given the user isn't an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      const userToQuery = 2;

      it(`Responds with a 403 for non-admin user`, () => {
        return supertest(app)
          .get(`/api/users/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(403);
      });
    });

    context(`Given the user is an admin`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));
      let userToQuery = 4;

      it(`Responds with a 204 for admin user`, () => {
        return supertest(app)
          .delete(`/api/users/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });
  });
});
