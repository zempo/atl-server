CREATE TABLE scripts (
id SERIAL PRIMARY KEY,
title_page TEXT NOT NULL,
body TEXT NOT NULL,
actors TEXT [],
tags TEXT [] DEFAULT ARRAY['Int', 'Ext', 'Description', 'Line-break']::text[],
date_created TIMESTAMP DEFAULT now() NOT NULL,
date_updated TIMESTAMP
);