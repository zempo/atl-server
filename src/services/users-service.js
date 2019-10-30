const xss = require("xss");
const Treeize = require("treeize");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");
// setup
const REGEX_ALPHA_NUM_UNDERSCORE = /(^[A-Za-z0-9\-\_]+$)/;
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getUsers(db) {
    return db.select("*").from("users");
  },
  getUserById(db, id) {
    return db
      .from("users")
      .select("*")
      .where("id", id)
      .first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => {
        return user;
      });
  },
  updateUser(db, id, newUserFields) {
    return db("users")
      .where({ "users.id": id })
      .update(newUserFields);
  },
  deleteUser(db, id) {
    return db("users")
      .where({ id })
      .delete();
  },
  uniqueUserName(db, user_name) {
    if (user_name == undefined) {
      return null;
    }
    return db("users")
      .where({ user_name })
      .first()
      .then((user) => {
        return !!user;
      });
  },
  uniqueEmail(db, email) {
    if (email == undefined) {
      return null;
    }
    return db("users")
      .where({ email })
      .first()
      .then((user) => {
        return !!user;
      });
  },
  checkAllFields(user) {
    for (const [key, value] of Object.entries(user)) {
      if (value == null) {
        return `Missing required '${key}' to create new user`;
      }
    }
    // if loops through and finds all keys
    return null;
  },
  validateUserName(user_name) {
    if (user_name == undefined) {
      return null;
    }
    if (!REGEX_ALPHA_NUM_UNDERSCORE.test(user_name)) {
      return "Username can only consist of alphanumeric characters, underscores, or hyphens.";
    }
    if (user_name.length < 3) {
      return "Username must be longer than 3 characters.";
    }
    if (user_name.length > 72) {
      return "Username must be less than 72 characters.";
    }
    if (user_name.startsWith(" ") || user_name.endsWith(" ")) {
      return "Username must not start or end with empty spaces";
    }
    return null;
  },
  validateEmail(email) {
    if (email == undefined) {
      return null;
    }
    if (validator.validate(email) == false) {
      return "Invalid email";
    }
    return null;
  },
  validatePassword(password) {
    if (password == undefined) {
      return null;
    }
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUsers(users) {
    return users.map(this.serializeUser);
  },
  serializeUser(user) {
    const userTree = new Treeize();

    const userData = userTree.grow([user]).getData()[0];

    return {
      admin: userData.admin,
      user_name: xss(userData.user_name),
      email: xss(userData.email),
      theme: xss(userData.theme),
      date_created: new Date(userData.date_created),
      date_updated: userData.date_updated || null
    };
  },
  serializeUsername(user) {
    const userTree = new Treeize();

    const userData = userTree.grow([user]).getData()[0];

    return {
      admin: userData.admin,
      user_name: xss(userData.user_name)
    };
  }
};

module.exports = UsersService;
