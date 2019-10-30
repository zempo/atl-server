const app = require("../src/app");
const knex = require("knex");
const helpers = require("./test-helpers");

describe(`Endpoints to access scripts`, () => {
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

  describe(`GET user's scripts from /api/scripts/:user_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given this user hasn't created any scripts`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 404 for user with no scripts`, () => {
        let userToQuery = 5;

        return supertest(app)
          .get(`/api/scripts/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[4]))
          .expect(404, { error: "This user has no scripts at the moment" });
      });
    });

    context(`Given this user has created 1 or more scripts`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 200 and scripts with nested user data`, () => {
        let userToQuery = 1;

        const expectedScripts = testScripts
          .filter((script) => {
            if (script["user_id"] == userToQuery) {
              return true;
            } else {
              return false;
            }
          })
          .map((script) => {
            return helpers.makeExpectedScript(testUsers, script);
          });

        return supertest(app)
          .get(`/api/scripts/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedScripts);
      });
    });
  });

  describe(`GET a single user script from /api/scripts/:user_id/:script_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given a user's script no longer exists in the database`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 404 for missing script`, () => {
        let userToQuery = 1;
        let scriptToQuery = 123454321;

        return supertest(app)
          .get(`/api/scripts/${userToQuery}/${scriptToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: "This resource might have been moved or deleted." });
      });
    });

    context(`Given a user's script exists in the database`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 200 and scripts with nested user data`, () => {
        let userToQuery = 1;
        let scriptToQuery = 1;

        const expectedScripts = testScripts
          .filter((script) => {
            if (script["user_id"] == userToQuery && script["id"] == scriptToQuery) {
              return true;
            } else {
              return false;
            }
          })
          .map((script) => {
            return helpers.makeExpectedScript(testUsers, script);
          });

        return supertest(app)
          .get(`/api/scripts/${userToQuery}/${scriptToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedScripts);
      });
    });
  });

  describe(`POST a new script to /api/scripts/:user_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context("Given empty request body", () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Posts new script with all the default values.`, () => {
        let userToQuery = 1;
        let testUser = testUsers[userToQuery - 1];
        let newScript = {};

        return supertest(app)
          .post(`/api/scripts/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newScript)
          .expect(201)
          .expect((res) => {
            // console.log(res.body);
            expect(res.headers.location).to.eql(`/api/scripts/${userToQuery}/${res.body.id}`);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("date_created");
            expect(res.body).to.have.property("date_updated");
            expect(res.body).to.have.property("title");
            expect(res.body.title).to.eql("UNTITLED PROJECT");
            expect(res.body).to.have.property("author");
            expect(res.body.author).to.eql("Lorem of Ipsum");
            expect(res.body).to.have.property("subtitle");
            expect(res.body.subtitle).to.eql("An Original Screenplay");
            expect(res.body).to.have.property("body");
            expect(res.body.body).to.eql("");
            expect(res.body).to.have.property("actors");
            expect(res.body.actors).to.be.an("array");
            expect(res.body.actors).to.include.members(["John", "Jane"]);
            expect(res.body).to.have.property("tags");
            expect(res.body.tags).to.be.an("array");
            // default tags will change over time
            expect(res.body.tags).to.include.members(["Int", "Ext", "Description", "Line-break"]);
            expect(res.body).to.have.property("user");
            expect(res.body.user).to.be.an("object");
            expect(res.body.user).to.include({ id: testUser.id });
            expect(res.body.user).to.include({ admin: testUser.admin });
            expect(res.body.user).to.include({ theme: testUser.theme });
            expect(res.body.user).to.include({ user_name: testUser.user_name });
            expect(res.body.user).to.include({ date_created: testUser.date_created });
            const expectedDate = new Date().toLocaleString("en", { timeZone: "America/Los_Angeles" });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            // when testing for time, test only this suite
            // this.retries() is insufficient when testing all suites

            // expect(actualDate).to.eql(expectedDate);
          });
      });
    });

    context("Given a complete request body", () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Posts new script that includes values from response body.`, () => {
        let userToQuery = 1;
        let testUser = testUsers[userToQuery - 1];
        let newScript = {
          title: "Last Christmas, I gave you my heart",
          author: "Quentin Notarantino",
          subtitle: "A gruesome, yet surprisingly wholesome, holiday movie",
          body:
            "[Int.] Santa's Workshop. [Description] Sunrise over the North Pole. Santa fastens his suspenders and looks solemnly at Ms. Claus. [Santa] Ho, Ho, Ho (weakly).",
          actors: ["Mindy Renee-Claus", "Santa", "Elfonzo"],
          tags: ["PAN", "FADE-IN", "New Tag", "Int", "Ext", "Description", "Line-break"]
        };

        return supertest(app)
          .post(`/api/scripts/${userToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newScript)
          .expect(201)
          .expect((res) => {
            // console.log(res.body)
            expect(res.headers.location).to.eql(`/api/scripts/${userToQuery}/${res.body.id}`);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("date_created");
            expect(res.body).to.have.property("date_updated");
            expect(res.body).to.have.property("title");
            expect(res.body.title).to.eql("Last Christmas, I gave you my heart");
            expect(res.body).to.have.property("author");
            expect(res.body.author).to.eql("Quentin Notarantino");
            expect(res.body).to.have.property("subtitle");
            expect(res.body.subtitle).to.eql("A gruesome, yet surprisingly wholesome, holiday movie");
            expect(res.body).to.have.property("body");
            expect(res.body.body).to.eql(
              "[Int.] Santa's Workshop. [Description] Sunrise over the North Pole. Santa fastens his suspenders and looks solemnly at Ms. Claus. [Santa] Ho, Ho, Ho (weakly)."
            );
            expect(res.body).to.have.property("actors");
            expect(res.body.actors).to.be.an("array");
            expect(res.body.actors).to.include.members(["Mindy Renee-Claus", "Santa", "Elfonzo"]);
            expect(res.body).to.have.property("tags");
            expect(res.body.tags).to.be.an("array");
            // default tags will change over time
            expect(res.body.tags).to.include.members([
              "PAN",
              "FADE-IN",
              "New Tag",
              "Int",
              "Ext",
              "Description",
              "Line-break"
            ]);
            expect(res.body).to.have.property("user");
            expect(res.body.user).to.be.an("object");
            expect(res.body.user).to.include({ id: testUser.id });
            expect(res.body.user).to.include({ admin: testUser.admin });
            expect(res.body.user).to.include({ theme: testUser.theme });
            expect(res.body.user).to.include({ user_name: testUser.user_name });
            expect(res.body.user).to.include({ date_created: testUser.date_created });
            const expectedDate = new Date().toLocaleString("en", { timeZone: "America/Los_Angeles" });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            // when testing for time, test only this suite
            // this.retries() is insufficient when testing all suites

            // expect(actualDate).to.eql(expectedDate);
          });
      });
    });
  });

  describe(`DELETE a singe user script at /api/scripts/:user_id/:script_id`, () => {
    after("spacing", () => console.log("-------------------------------------\n"));
    context(`Given the script does not exist or belong to user`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 404 when not user's script`, () => {
        let userToQuery = 1;
        let scriptToQuery = 2;

        return supertest(app)
          .delete(`/api/scripts/${userToQuery}/${scriptToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: "This resource might have been moved or deleted." });
      });

      it(`Responds with a 404 when does not exist`, () => {
        let userToQuery = 1;
        let scriptToQuery = 2234;

        return supertest(app)
          .delete(`/api/scripts/${userToQuery}/${scriptToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: "This resource might have been moved or deleted." });
      });
    });

    context(`Given the script exists and belongs to user`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      it(`Responds with a 204 and deletes resource`, () => {
        let userToQuery = 1;
        let scriptToQuery = 1;

        return supertest(app)
          .delete(`/api/scripts/${userToQuery}/${scriptToQuery}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });
  });

  describe(`PATCH a single user script at /api/scripts/:user_id/:script_id`, () => {
    context(`Given a valid response body`, () => {
      after("spacer", () => console.log("\n"));
      beforeEach("Insert Scripts", () => helpers.seedScripts(db, testUsers, testScripts));

      const validEntries = [
        {
          title: "Last Christmas, I gave you my heart: Part II"
        },
        {
          author: "Quentin Definitely Notarantino"
        },
        {
          subtitle: "A gruesome, yet surprisingly wholesome, holiday sequel"
        },
        {
          body:
            "[Int.] Santa's Workshop. [Description] Sunrise over the North Pole Again. Santa fastens his suspenders and looks solemnly at Elfonzo..."
        },
        {
          actors: ["Mindy Renee-Elfie", "Santa", "Elfonzo Elfie"]
        },
        {
          tags: ["PAN", "FADE-IN", "New Tag", "Int", "Ext", "Description", "Line-break"]
        }
      ];

      validEntries.forEach((entry) => {
        it(`Updates ${Object.keys(entry)[0]}`, () => {
          const testUser = testUsers[0];
          const testScript = testScripts[0];

          return supertest(app)
            .patch(`/api/scripts/${testUser.id}/${testScript.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(entry)
            .expect(204);
        });
      });
    });
  });
});
