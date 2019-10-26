BEGIN;

TRUNCATE
  scripts,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (admin, full_name, email, password)
    VALUES
    (TRUE, 'Mark Wallace', 'markwallace@scriptmail.com', '$2a$10$i57JnoTkJYAT3uFoPtSOze2FJziY6ldRtDHwTrnoDPpbYSMpxhRqq'),
    (default, 'Mike Man', 'jenglish@uk.gov', '$2a$10$HlKayYzBDUqodJDIzzJIgOcxGlgoGKG2tdqiRcfRbONRscR6cLbNq'),
    (default, 'Mindy Momo', 'mmomo@gmail.com', '$2a$10$xK7keBV2VfSBU9P4W9ENYu5DX96Zn4ONnTuihzeXDmY552gmk5FuC');

INSERT INTO scripts (title_page, body, user_id)
    VALUES
    ('Great New Beginnings [line] Mark Wallace [line] An Original Screenplay', '[Int. Facebook HQ] Mark Zuckerberg slowly closes his laptop -- letting out a heavy sigh. [Mark] It''s the best website I have ever seen. Impossible. Simply impossible! How can I compete!?', 1),
    ('Jom and Terry [line] Mike Man [line] Based on the classic cartoon', '[Ext. House with no controversial depictions of women of color.] Tom and Jerry have two children named Jom and Terry. They have since matured greatly and sought out psychiatric help to address their issues. Surprisingly they discovered a romantic compatibility. [Tom] Yeeeeeowwwwwwwww. [Jerry] *smirks silently.', 2);

-- CREATE TABLE scripts (
-- id SERIAL PRIMARY KEY,
-- title_page TEXT NOT NULL,
-- body TEXT NOT NULL,
-- date_created TIMESTAMP DEFAULT now() NOT NULL,
-- date_updated TIMESTAMP
-- );

COMMIT; 