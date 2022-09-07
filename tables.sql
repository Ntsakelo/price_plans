create table price_plan (
    id serial not null primary key ,
    plan_name text not null,
    sms_price int not null,
    call_price int not null
);

create table users (
    id serial not null primary key,
    username text not null,
    plan_id int not null,
    foreign key (plan_id) references price_plan(id) on delete cascade
);

insert into price_plan (plan_name,sms_price,call_price) values ('sms100',0.20,2.35);
insert into price_plan (plan_name,sms_price,call_price) values ('sms200',0.45,1.75);
insert into price_plan (plan_name,sms_price,call_price) values ('weekly',0.17,1.54);