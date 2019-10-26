CREATE TABLE scripts (
id SERIAL PRIMARY KEY,
title_page TEXT NOT NULL,
body TEXT NOT NULL,
date_created TIMESTAMP DEFAULT now() NOT NULL,
date_updated TIMESTAMP
);