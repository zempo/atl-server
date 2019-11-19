CREATE TABLE scripts (
id SERIAL PRIMARY KEY,
title TEXT DEFAULT 'UNTITLED PROJECT',
author TEXT DEFAULT 'J. Silvers', 
subtitle TEXT DEFAULT 'An Original Screenplay',
body TEXT DEFAULT '',
actors TEXT [] DEFAULT ARRAY['John', 'Jane']::text[],
tags TEXT [] DEFAULT ARRAY['Int', 'Ext', 'Description', 'Angle On', 'Close-up', 'Continuation', 'Dissolve To', 'Fade In', 'Fade Out', 'Insert', 'Intercut', 'Montage', 'O.S.', 'POV', 'Series of Shots', 'Split Screen', 'Super', 'V.O.', 'Line-Break']::text[],
date_created TIMESTAMP DEFAULT now() NOT NULL,
date_updated TIMESTAMP 
);  