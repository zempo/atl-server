const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");

// see admin-endpoints.spec.js for admin endpoints
describe(`Unauthorized, Authorized, and Non-Admin Users`, () => {
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

  describe(`GET a specific user at api/users/`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given non-admin user queries their own profile`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      let userToQuery = 4;
      let expectedUser = helpers.makeExpectedUser(testUsers[userToQuery - 1]);

      it(`Responds with a 200 and user data`, () => {
        return supertest(app)
          .get(`/api/users/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[3]))
          .expect(200, expectedUser);
      });
    });
  });

  describe(`POST all users at api/users/`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context("Incomplete user registration", () => {
      after("spacing", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      const incompleteFields = [
        {
          user_name: "mike",
          email: "mickey@gmail.com"
        },
        {
          password: "passwordF3@"
        },
        {
          user_name: "mike",
          password: "passwordF3@"
        }
      ];
      incompleteFields.forEach((entry) => {
        it(`Throws error when missing ${Object.keys(entry)[0]}`, () => {
          return supertest(app)
            .post(`/api/users`)
            .send(entry)
            .expect(400)
            .expect((res) => {
              console.log("");
              console.log(entry[Object.keys(entry)[0]]);
              console.log("");
              console.log(res.body);
              console.log("");
              expect(res.body).to.have.property("error");
            });
        });
      });
    });

    context("Invalid user registration", () => {
      after("spacing", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      const invalidFields = [
        {
          user_name: "test-user-1",
          email: "mickey@gmail.com",
          password: "passwordF3@"
        },
        {
          user_name: "mike spacers",
          email: "mickey@gmail.com",
          password: "passwordF3@"
        },
        {
          user_name: "mi",
          email: "mickey@gmail.com",
          password: "passwordF3@"
        },
        {
          user_name: "mdsi",
          email: "test1@email.com",
          password: "passwordF3@"
        },
        {
          user_name: "mike_has_a_really_long_username_how_did_he_have_the_patience_to_type_this_out",
          email: "mickey@gmail.com",
          password: "passwordF3@"
        },
        {
          user_name: "mikenospacers",
          email: "no",
          password: "passwordF3@"
        },
        {
          user_name: "mike",
          email: "mickey@gmail.com",
          password: "passwordF@"
        },
        {
          user_name: "mikespacers",
          email: "mickey@gmail.com",
          password: "short1!"
        },
        {
          user_name: "mikespacers",
          email: "mickey@gmail.com",
          password: "longones23090kokdfogkdfookpiojdfoigjiojregiojg-ffd-fdf-1!"
        },
        {
          user_name: "mikespacers",
          email: "mickey@gmail.com",
          password: " averagePWD!"
        },
        {
          user_name: "mikespacers",
          email: "mickey@gmail.com",
          password: "averagePWD! "
        }
      ];
      invalidFields.forEach((entry) => {
        it(`Throws Error when invalid ${Object.keys(entry)[0]}`, () => {
          return supertest(app)
            .post(`/api/users`)
            .send(entry)
            .expect(400)
            .expect((res) => {
              console.log("");
              console.log(entry[Object.keys(entry)[0]]);
              console.log("");
              console.log(res.body);
              console.log("");
              expect(res.body).to.have.property("error");
            });
        });
      });
    });

    context("Complete user registration", () => {
      after("spacing", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      const validUsers = [
        {
          user_name: "mikenospacers",
          email: "mickey@gmail.com",
          password: "passwordF3@"
        },
        {
          user_name: "mikenospacers",
          email: "mickey@gmail.com",
          password: "passwordF3@",
          theme: "#ff5722"
        }
      ];

      validUsers.forEach((request) => {
        it(`Creates valid user ${request.theme ? "with theme" : ""}`, () => {
          return supertest(app)
            .post(`/api/users`)
            .send(request)
            .expect(201)
            .expect((res) => {
              // console.log(res.body);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("id");
              expect(res.body).to.have.property("admin");
              expect(res.body).to.have.property("user_name");
              expect(res.body).to.have.property("theme");
              expect(res.body).to.have.property("email");
              expect(res.body).to.have.property("date_created");
              expect(res.body.user_name).to.eql(request.user_name);
              expect(res.body.full_name).to.eql(request.full_name);
              expect(res.body.email).to.eql(request.email);
            });
        });
      });
    });
  });

  describe(`DELETE a specific user at api/users/:user_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));

    context(`Given the non-admin user queries their own profile`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));
      let userToQuery = 2;

      it(`Responds with a 204 for non-admin user`, () => {
        return supertest(app)
          .delete(`/api/users/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .expect(204);
      });
    });
  });

  describe(`PATCH a specific user at api/users/:user_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));

    context(`Given an invalid valid patch`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));
      let userToQuery = 2;
      let invalidEntries = [
        {
          user_name: "test-user-1"
        },
        {
          user_name: "ti"
        },
        {
          user_name: " testh"
        },
        {
          user_name: "markoddffffffffffffffffffffffffffffffffhrhhyhyyykopkereorpktpokerpotkertpoyyttys"
        },
        {
          email: "test1@email.com"
        },
        {
          email: "no"
        },
        {
          password: "short1!"
        },
        {
          password: "longones23090kokdfogkdfookpiojdfoigjiojregiojg-ffd-fdf-1!"
        },
        {
          password: " averagePWD2!"
        },
        {
          password: "averagePWD2! "
        }
      ];

      invalidEntries.forEach((entry) => {
        it(`Responds with 404 after invalid ${Object.keys(entry)[0]}`, () => {
          return supertest(app)
            .patch(`/api/users/${userToQuery}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
            .send(entry)
            .expect(400)
            .expect((res) => {
              console.log("");
              console.log(entry[Object.keys(entry)[0]]);
              console.log("");
              console.log(res.body);
              console.log("");
              expect(res.body).to.have.property("error");
            });
        });
      });
    });

    context(`Given a valid patch`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));
      let userToQuery = 2;
      let validEntries = [
        {
          user_name: "mikenospacers"
        },
        {
          email: "mickey@gmail.com"
        },
        {
          password: "passwordF3@"
        },
        {
          theme: "#ff5722"
        }
      ];
      validEntries.forEach((entry) => {
        it(`Responds with a 204 after patching ${Object.keys(entry)[0]}`, () => {
          return supertest(app)
            .patch(`/api/users/${userToQuery}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
            .expect(204);
        });
      });
    });
  });
});
