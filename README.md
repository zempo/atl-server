# Above the Line

_Your Scriptwriting Assistant_


## Links 

- Live App | [here](https://above-the-line.now.sh/)
- Client | [here](https://github.com/zempo/atl-client)

## Project Objective 

Most script-formatting software is expensive and utilizes conventional approaches to document editing. 
Based on the html approach to markup, this project seeks to bridge the gap between scriptwriters and the process of writing code.
In short, a simple language for formatting scripts and screenplays. 

## Scripts API (Quick Start) 

1. Clone this repository to your local machine `git clone https://github.com/zempo/atl-server.git YOUR-PROJECT-SERVER`
2. `cd` into cloned repository
3. Make a fresh start of your project's history with `rm -rf .git`
4. `mv example.env .env` to hide env variables.
5. Double-check your .gitignore
6. Triple-check your .gitignore 
7. `git init` followed by `npm i`
8. Create postgres database and relevant .env variables for deployment 

## Database Integration (With Postgresql)

1. Run `npm i knex` and then `npm i pg` (for postgres, in this case).
2. Reference the [Knex Documentation](https://knexjs.org/) for more.
3. A sample db url has been added to the example env
4. Getting started

```
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

console.log("connection successful");
```

## Technologies (Server)

### Main 
1. NodeJS with express
2. Postgresql with Knexjs, nodemon, and treeize
3. bcryptjs, boder-parser, jwt-authentication, valid-url
4. dotenv, cors, helmet, morgan, uuid, email-validator, winston, xss 
5. chai, mocha, supertest
