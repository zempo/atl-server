CREATE TYPE theme AS ENUM (
  '#4464AD',
  '#d45d5d',
  '#AD1457',
  '#E76F51',
  '#391463', 
  '#67597A',
  '#283593',
  '#1565C0',
  '#001F54',
  '#00695C',
  '#034078',
  '#073B3A',
  '#2E7D32',
  '#2E6171',
  '#388E3C',
  '#5E4955',
  '#6B8F71',
  '#8E3B46',
  '#5D4037',
  '#41292C',
  '#424242',
  '#455A64',
  '#264653',
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