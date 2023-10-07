\c greenmoons-dev

-- Clean all data in tables
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "movie_favorite" CASCADE;

-- Reset auto increment
ALTER SEQUENCE "movie_favorite" RESTART WITH 1;

-- Create users
insert into "user" (id, email, password)
values ('3b3c2b9e-0b7b-4b1c-8c0a-0e1b0b0b0b0b', 'prach.yot@gmail.com', '$2b$10$c7vyvezEHDrzAmVrjX8wcutIVq.XJNImZ6ZZK/Jh0Ff6jPWTLa4sq');