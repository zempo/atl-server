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

  const protectedEndpoints = [
    {
      name: "GET /api/scripts/:user_id",
      path: "/api/scripts/:user_id",
      method: supertest(app).get
    },
    {
      name: "POST /api/scripts/:user_id",
      path: "/api/scripts/:user_id",
      method: supertest(app).post
    },
    {
      name: "GET /api/scripts/:user_id/:script_id",
      path: "/api/scripts/:user_id/:script_id",
      method: supertest(app).get
    },
    {
      name: "PATCH /api/scripts/:user_id/:script_id",
      path: "/api/scripts/:user_id/:script_id",
      method: supertest(app).patch
    },
    {
      name: "DELETE /api/scripts/:user_id/:script_id",
      path: "/api/scripts/:user_id/:script_id",
      method: supertest(app).delete
    },
    {
      name: "GET /api/users",
      path: "/api/users",
      method: supertest(app).get
    },
    {
      name: "GET /api/users/:user_id",
      path: "/api/users/:user_id",
      method: supertest(app).get
    },
    {
      name: "DELETE /api/users/:user_id",
      path: "/api/users/:user_id",
      method: supertest(app).delete
    },
    {
      name: "PATCH /api/users/:user_id",
      path: "/api/users/:user_id",
      method: supertest(app).patch
    }
  ];

  protectedEndpoints.forEach((endpoint) => {
    describe(`${endpoint.name}`, () => {
      it(`responds with 401: 'Missing Bearer Token', when no token`, () => {
        return endpoint.method(endpoint.path).expect(401, { error: "Missing Bearer Token" });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = "bad-secret";
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized Request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { email: "user-not-existy", id: 1 };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized Request` });
      });
    });
  });
});
