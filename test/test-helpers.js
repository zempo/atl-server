const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeTestUsers() {
  return [
    {
      id: 1,
      admin: true,
      user_name: "test-user-1",
      password: "password",
      email: "test1@email.com",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 2,
      admin: false,
      user_name: "test-user-2",
      password: "password",
      email: "test2@email.com",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 3,
      admin: false,
      user_name: "test-user-3",
      password: "password",
      email: "test3@email.com",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 4,
      admin: false,
      user_name: "test-user-4",
      password: "password",
      email: "test4@email.com",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 5,
      admin: false,
      user_name: "test-user-5",
      password: "password",
      email: "test5@email.com",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
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
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[0].id
    },
    {
      id: 2,
      title: "Test Script 2",
      author: "Author 1",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass again.",
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[1].id
    },
    {
      id: 3,
      title: "Test Script 3",
      author: "Author 2",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a third time.",
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[1].id
    },
    {
      id: 4,
      title: "Test Script 4",
      author: "Author 1",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a fourth time.",
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[0].id
    },
    {
      id: 5,
      title: "Test Script 5",
      author: "Author 3",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a fifth time.",
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[2].id
    },
    {
      id: 6,
      title: "Test Script 6",
      author: "Author 4",
      subtitle: "Based on an original test",
      body: "[Int.] Mocha Testing Suite [Desc.] All tests pass a sixth time.",
      actors: "{Mark,Mary}",
      tags: "{Int,Ext,Description,Line-break}",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
      user_id: users[3].id
    }
  ];
}

function makeExpectedUserScript(users, script) {
  const usr = users.find((user) => user.id === script.user_id);

  return {
    id: script.id,
    title: script.title,
    author: script.author,
    subtitle: script.subtitle,
    body: script.body,
    actors: script.actors,
    tags: script.tags,
    date_created: card.date_created,
    date_modified: card.date_modified,
    user: {
      id: usr.id,
      admin: usr.admin,
      user_name: usr.user_name,
      date_created: usr.date_created
    }
  };
}

module.exports = {
  makeTestUsers,
  makeTestScripts,
  makeExpectedUserScript
};