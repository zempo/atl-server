const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1st user is admin
function makeTestUsers() {
  return [
    {
      id: 1,
      admin: true,
      user_name: "test-user-1",
      password: "password",
      email: "test1@email.com",
      theme: "#607d8b",
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null
    },
    {
      id: 2,
      admin: false,
      user_name: "test-user-2",
      password: "password",
      email: "test2@email.com",
      theme: "#607d8b",
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null
    },
    {
      id: 3,
      admin: false,
      user_name: "test-user-3",
      password: "password",
      email: "test3@email.com",
      theme: "#607d8b",
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null
    },
    {
      id: 4,
      admin: false,
      user_name: "test-user-4",
      password: "password",
      email: "test4@email.com",
      theme: "#607d8b",
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null
    },
    {
      id: 5,
      admin: false,
      user_name: "test-user-5",
      password: "password",
      email: "test5@email.com",
      theme: "#607d8b",
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null
    }
  ];
}

// 5th user has no scripts
function makeTestScripts(users) {
  return [
    {
      id: 1,
      title: "Test Script 1",
      author: "Author 1",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[0].id
    },
    {
      id: 2,
      title: "Test Script 2",
      author: "Author 1",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass again.",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[1].id
    },
    {
      id: 3,
      title: "Test Script 3",
      author: "Author 2",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a third time.",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[1].id
    },
    {
      id: 4,
      title: "Test Script 4",
      author: "Author 1",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a fourth time.",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[0].id
    },
    {
      id: 5,
      title: "Test Script 5",
      author: "Author 3",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a fifth time.",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[2].id
    },
    {
      id: 6,
      title: "Test Script 6",
      author: "Author 4",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a sixth time.",
      actors: ["Mark", "Mary"],
      tags: ["Int", "Ext", "Description", "Line-break"],
      date_created: "2029-01-22T16:28:32.615Z",
      date_updated: null,
      user_id: users[3].id
    }
  ];
}

function makeExpectedUser(user) {
  return {
    id: user.id,
    admin: user.admin,
    user_name: user.user_name,
    email: user.email,
    theme: user.theme,
    date_created: user.date_created,
    date_updated: user.date_updated
  };
}

function makeExpectedScript(users, script) {
  const usr = users.find((user) => user.id === script.user_id);

  return {
    id: script.id,
    date_created: script.date_created,
    date_updated: script.date_updated,
    title: script.title,
    author: script.author,
    subtitle: script.subtitle,
    body: script.body,
    actors: script.actors,
    tags: script.tags,
    user: {
      id: usr.id,
      admin: usr.admin,
      user_name: usr.user_name,
      theme: usr.theme,
      date_created: usr.date_created
    }
  };
}

function makeMaliciousScript(user) {
  const maliciousScript = {
    id: 666,
    date_created: new Date().toISOString(),
    date_updated: null,
    title: `Hacky-sack <script>alert("we are anonymous");</script>`,
    author: `Nick-nack <script>alert("Currella De Ville");</script>`,
    subtitle: `Paddy-whack <script>alert("Based on a hacky plot");</script>`,
    body: "[Int.] Some evil lair [<script>Evil Tag<script/>] All tests pass",
    actors: ["Mark", "Mary"],
    tags: ["Int", "Ext", "Description", "Line-break"],
    user_id: user.id
  };

  const expectedScript = {
    ...makeExpectedScript([user], maliciousScript),
    title: `Hacky-sack &lt;script&gt;alert("we are anonymous");&lt;/script&gt;`,
    author: `Nick-nack &lt;script&gt;alert("Currella De Ville");&lt;/script&gt;`,
    subtitle: `Paddy-whack &lt;script&gt;alert("Based on a hacky plot");&lt;/script&gt;`,
    body: "[Int.] Some evil lair [&lt;script&gt;Evil Tag&lt;script/&gt;] All tests pass"
  };

  return {
    maliciousScript,
    expectedScript
  };
}

function makeAppFixtures() {
  const testUsers = makeTestUsers();
  const testScripts = makeTestScripts(testUsers);

  return { testUsers, testScripts };
}

function cleanTables(db) {
  return db.raw(`TRUNCATE scripts, users RESTART IDENTITY CASCADE`);
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() => db.raw(`SELECT setVal('users_id_seq', ?)`, [users[users.length - 1].id]));
}

function seedScripts(db, users, scripts) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("scripts").insert(scripts);
    await trx.raw(`SELECT setval('scripts_id_seq', ?)`, [scripts[scripts.length - 1].id]);
  });
}

function seedMaliciousScript(db, user, script) {
  return seedUsers(db, [user]).then(() => db.into("scripts").insert(script));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRY
  });

  return `Bearer ${token}`;
}

module.exports = {
  makeTestUsers,
  makeTestScripts,
  makeExpectedScript,
  makeExpectedUser,
  makeMaliciousScript,
  makeAppFixtures,
  cleanTables,
  seedUsers,
  seedScripts,
  seedMaliciousScript,
  makeAuthHeader
};
