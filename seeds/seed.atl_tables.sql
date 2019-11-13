BEGIN;

TRUNCATE
  scripts,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (admin, user_name, email, password)
    VALUES
    (TRUE, 'MarkWallace', 'markwallace@scriptmail.com', '$2a$10$i57JnoTkJYAT3uFoPtSOze2FJziY6ldRtDHwTrnoDPpbYSMpxhRqq'),
    (default, 'MikeMan', 'jenglish@uk.gov', '$2a$10$HlKayYzBDUqodJDIzzJIgOcxGlgoGKG2tdqiRcfRbONRscR6cLbNq'),
    (default, 'MindyMomo', 'mmomo@gmail.com', '$2a$10$xK7keBV2VfSBU9P4W9ENYu5DX96Zn4ONnTuihzeXDmY552gmk5FuC');

INSERT INTO scripts (title, author, subtitle, body, actors, user_id)
    VALUES
    ('Great New Beginnings', 'Mark Wallace', 'An Original Screenplay', '[Int. Facebook HQ] Mark Zuckerberg slowly closes his laptop -- letting out a heavy sigh. {Mark} It''s the best website I have ever seen. Impossible. Simply impossible! How can I compete!?',ARRAY ['Mark','Eduardo'], 1),
    ('Jom and Terry', 'Mike Man', 'Based on the classic cartoon', '[Ext.] House with no controversial depictions of color. [Desc] Tom and Jerry have two children named Jom and Terry. They have since matured greatly and sought out psychiatric help to address their issues. Surprisingly they discovered a romantic compatibility. {Tom} Yeeeeeowwwwwwwww. {Jerry} *smirks silently.',ARRAY ['Jerry Julliard'], 2),
    (default, default, default, default, default, 3),
    (default, default, default, default, default, 2),
    (default, default, default, default, default, 1),
    (default, default, default, default, default, 3),
    (default, default, default, default, default, 2),
    (default, default, default, default, default, 1);
  
COMMIT; 