CREATE TABLE users (
id SERIAL PRIMARY KEY,
admin boolean DEFAULT FALSE,
user_name TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
date_created TIMESTAMP NOT NULL DEFAULT now(),
date_modified TIMESTAMP
);

ALTER TABLE scripts ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL; 