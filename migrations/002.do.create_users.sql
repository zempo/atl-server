CREATE TYPE theme AS ENUM (
  '#c62828',
  '#AD1457',
  '#6A1B9A',
  '#4527A0',
  '#283593',
  '#1565C0',
  '#0277BD',
  '#00838F',
  '#00695C',
  '#2E7D32',
  '#558B2F',
  '#827717',
  '#FF6F00',
  '#EF6C00',
  '#D84315',
  '#4E342E',
  '#424242',
  '#37474F',
  '#212121'
); 
 
CREATE TABLE users (
id SERIAL PRIMARY KEY,
admin boolean DEFAULT FALSE,
user_name TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL UNIQUE, 
theme theme DEFAULT '#37474F',
date_created TIMESTAMP NOT NULL DEFAULT now(),
date_updated TIMESTAMP
);
 
ALTER TABLE scripts ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;  