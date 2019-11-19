BEGIN;

TRUNCATE
  scripts,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (admin, user_name, email, password)
    VALUES
    (TRUE, 'MarkWallace', 'markwallace@scriptmail.com', '$2a$10$i57JnoTkJYAT3uFoPtSOze2FJziY6ldRtDHwTrnoDPpbYSMpxhRqq'),
    (default, 'Dylan_Demo', 'demo@atl.com', '$2a$10$rrRl.JlaHBatkCtqMb9LQeULolgY229iFXdRn8T8CKogxszXyMzCG'), 
    (default, 'MindyMomo', 'mmomo@gmail.com', '$2a$10$xK7keBV2VfSBU9P4W9ENYu5DX96Zn4ONnTuihzeXDmY552gmk5FuC');

INSERT INTO scripts (title, author, subtitle, body, actors, user_id)
    VALUES
    ('Great New Beginnings', 'Mark Wallace', 'An Original Screenplay', '[Int. Facebook HQ] Mark Zuckerberg slowly closes his laptop -- letting out a heavy sigh. {Mark} It''s the best website I have ever seen. Impossible. Simply impossible! How can I compete!?',ARRAY ['Mark','Eduardo'], 1),
    ('Jom and Terry', 'Mike Man', 'Based on the classic cartoon', '[Ext.] House with no controversial depictions of color. [Desc] Tom and Jerry have two children named Jom and Terry. They have since matured greatly and sought out psychiatric help to address their issues. Surprisingly they discovered a romantic compatibility. {Tom} Yeeeeeowwwwwwwww. {Jerry} *smirks silently.',ARRAY ['Jerry Julliard'], 3),
    (default, default, default, default, default, 3),
    (default, default, default, default, default, 2),
    ('FizzBuzz III', 'Zark Muckerberg', 'Based on these Numbers...', default, default, 1),
    ('Old Yeller 2: Bite Back', 'Virginia Woof', 'A Family-Friendly Film', default, default, 1),
    ('The Simpsons Did it', 'Trey Parker & Matt Stone', 'Again', default, default, 1),
    ('Boots n Cats', 'Kitt Y. Whiskers', default, default, default, 1),
    ('Live 50% off, or Die Hard', default, default, default, default, 1),
    ('The Situation Closet', default, default, default, default, 1),
    ('The Step-Parent Trap', default, default, default, default, 1),
    ('Baking Bad: With Paul Hollywood', 'Netflix', 'A Show I wish to See', default, default, 1),
    ('Seven things I wish I Googled', 'Bobby Bing', 'The Number 2 Film', default, default, 1),
    ('For Each, Their Own', default, 'An Original Method', default, default, 1),
    ('Carry the One', default, default, default, default, 1),
    ('Adventures of an Ardvark', default, default, default, default, 1),
    ('Doe, A Deer', 'Ray Adrop', 'A Female Deer', default, default, 1),
    ('Ferris Bueller''s Day On', default, 'An Original Story', default, default, 1),
    ('The Windmill of Twists', 'M Night Shyamalan', default, default, default, 1),
    ('Country Roads', 'Almos T. Heven', 'Carry Me Home', default, default, 1),
    ('Santa''s Here', 'Elfonzo', 'A Christmas Adventure', default, default, 1),
    ('Santa''s Sweatshop', 'Elfonzo', 'Based on 37 Human Rights Violations...', default, default, 1),
    ('Jericho: Season 3', 'Everyone', 'Please Don''t Cancel This Show', default, default, 1),
    (default, default, default, default, default, 1),
        ('FizzBuzz III', 'Zark Muckerberg', 'Based on these Numbers...', default, default, 2),
    ('Old Yeller 2: Bite Back', 'Virginia Woof', 'A Family-Friendly Film', default, default, 2),
    ('The Simpsons Did it', 'Trey Parker & Matt Stone', 'Again', default, default, 2),
    ('Boots n Cats', 'Kitt Y. Whiskers', default, default, default, 2),
    ('Live 50% off, or Die Hard', default, default, default, default, 2),
    ('The Situation Closet', default, default, default, default, 2),
    ('The Step-Parent Trap', default, default, default, default, 2),
    ('Baking Bad: With Paul Hollywood', 'Netflix', 'A Show I wish to See', default, default, 2),
    ('Seven things I wish I Googled', 'Bobby Bing', 'The Number 2 Film', default, default, 2),
    ('For Each, Their Own', default, 'An Original Method', default, default, 2),
    ('Carry the One', default, default, default, default, 2),
    ('Adventures of an Ardvark', default, default, default, default, 2),
    ('Doe, A Deer', 'Ray Adrop', 'A Female Deer', default, default, 2),
    ('Ferris Bueller''s Day On', default, 'An Original Story', default, default, 2),
    ('The Windmill of Twists', 'M Night Shyamalan', default, default, default, 2),
    ('Country Roads', 'Almos T. Heven', 'Carry Me Home', default, default, 2),
    ('Santa''s Here', 'Elfonzo', 'A Christmas Adventure', default, default, 2),
    ('Santa''s Sweatshop', 'Elfonzo', 'Based on 37 Human Rights Violations...', default, default, 2),
    ('Jericho: Season 3', 'Everyone', 'Please Don''t Cancel This Show', default, default, 2);
  
COMMIT; 