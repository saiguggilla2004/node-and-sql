-- create table user(
--     id varchar(50) unique primary key,
--     username varchar(50) unique not null,
--     email varchar(50) not null unique,
--     password varchar(50) not null
-- );
-- select * from user;
-- -- truncate table user;
select count(id) from user;
use delta_app;
select * from user where email="Rusty.Bernhard@yahoo.com";