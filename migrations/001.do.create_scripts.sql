CREATE TABLE scripts (
id SERIAL PRIMARY KEY,
title TEXT DEFAULT 'UNTITLED PROJECT',
author TEXT DEFAULT 'J. Silvers', 
subtitle TEXT DEFAULT 'An Original Screenplay',
body TEXT DEFAULT '',
actors TEXT [] DEFAULT ARRAY['John', 'Jane']::text[],
tags TEXT [] DEFAULT ARRAY['Header', 'Action', 'Transition', 'Shot']::text[],
date_created TIMESTAMP DEFAULT now() NOT NULL,
date_updated TIMESTAMP 
);  