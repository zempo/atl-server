CREATE TYPE theme AS ENUM (
  '#b71c1c',
  '#880e4f',
  '#4a148c',
  '#311b92',
  '#1a237e',
  '#0d47a1',
  '#01579b',
  '#006064',
  '#004d40',
  '#194d33',
  '#33691e',
  '#827717',
  '#f57f17',
  '#ff6f00',
  '#e65100',
  '#bf360c',
  '#3e2723',
  '#263238',
  '#000000'
); 
 
CREATE TABLE users (
id SERIAL PRIMARY KEY,
admin boolean DEFAULT FALSE,
user_name TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL UNIQUE, 
theme theme DEFAULT '#263238',
date_created TIMESTAMP NOT NULL DEFAULT now(),
date_updated TIMESTAMP
);
 
ALTER TABLE scripts ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;  