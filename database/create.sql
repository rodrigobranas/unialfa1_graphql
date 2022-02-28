drop schema unialfa cascade;
create schema unialfa;

create table unialfa.publisher (
	id_publisher serial primary key,
	name text not null
);
create table unialfa.book (
	id_book serial primary key,
	id_publisher integer null references unialfa.publisher (id_publisher),
	title text not null,
	price numeric not null,
	pages integer null,
	category text not null
);
create table unialfa.author (
	id_author serial primary key,
	name text not null
);
create table unialfa.book_author (
	id_book integer not null,
	id_author integer not null
);

insert into unialfa.publisher (name) values ('Addison-Wesley');
insert into unialfa.publisher (name) values ('Manning');
insert into unialfa.publisher (name) values ('Pragmatic');

insert into unialfa.book (id_publisher, title, category, price) values (1,'Clean Code','TECHNOLOGY', 59.90);
insert into unialfa.book (id_publisher, title, category, price) values (1,'Patterns of Enterprise Application Architecture', 'TECHNOLOGY', 89.90);
insert into unialfa.book (id_publisher, title, category, price) values (2,'Design Patterns','TECHNOLOGY',99.90);

insert into unialfa.author (name) values ('Robert Martin');
insert into unialfa.author (name) values ('Martin Fowler');
insert into unialfa.author (name) values ('Vaughn Vernon');
insert into unialfa.author (name) values ('Erich Gamma');
insert into unialfa.author (name) values ('Richard Helm');
insert into unialfa.author (name) values ('Ralph Johnson');
insert into unialfa.author (name) values ('John Vlissides');

insert into unialfa.book_author (id_book, id_author) values (1,1);
insert into unialfa.book_author (id_book, id_author) values (2,2);
insert into unialfa.book_author (id_book, id_author) values (3,4);
insert into unialfa.book_author (id_book, id_author) values (3,5);
insert into unialfa.book_author (id_book, id_author) values (3,6);
insert into unialfa.book_author (id_book, id_author) values (3,7);
