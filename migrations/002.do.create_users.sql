CREATE TYPE theme AS ENUM (
  '#AD1457',
  '#d45d5d',
  '#E76F51',
  '#6B8F71',
  '#388E3C',
  '#2E7D32',
  '#00695C',
  '#455A64',
  '#2E6171',
  '#1565C0',
  '#4464AD',
  '#67597A',
  '#5E4955',
  '#5D4037',
  '#8E3B46',
  '#424242',
  '#264653',
  '#073B3A',
  '#034078',
  '#283593',
  '#001F54',
  '#391463', 
  '#41292C',
  '#1B2021'
); 
 
CREATE TABLE users (
id SERIAL PRIMARY KEY,
admin boolean DEFAULT FALSE,
user_name TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
email TEXT NOT NULL UNIQUE, 
theme theme DEFAULT '#455A64',
date_created TIMESTAMP NOT NULL DEFAULT now(),
date_updated TIMESTAMP
);
 
ALTER TABLE scripts ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;  