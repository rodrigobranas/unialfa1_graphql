const connection = require("./connection");

exports.getBooks = async function () {
	const books = await connection.query("select * from unialfa.book", []);
	for (const book of books) {
		book.idBook = `${book.id_book}`;
		book.idPublisher = `${book.id_publisher}`;
	}
	return books;
}

exports.getBooksByTitle = async function (title) {
	const books = await connection.query("select * from unialfa.book where title = $1", [title]);
	for (const book of books) {
		book.idBook = `${book.id_book}`;
		book.idPublisher = `${book.id_publisher}`;
	}
	return books;
}

exports.getAuthors = async function () {
	const authors = await connection.query("select * from unialfa.author", []);
	for (const author of authors) {
		author.idAuthor = `${author.id_author}`;
	}
	return authors;
}

exports.getAuthorsByName = async function (name) {
	const authors = await connection.query("select * from unialfa.author where name = $1", [name]);
	for (const author of authors) {
		author.idAuthor = `${author.id_author}`;
	}
	return authors;
}

exports.getAuthorsByIdBook = async function (idBook) {
	const authors = await connection.query("select * from unialfa.author join unialfa.book_author using (id_author) where id_book = $1", [idBook]);
	for (const author of authors) {
		author.idAuthor = `${author.id_author}`;
	}
	return authors;
}

exports.getPublisher = async function (idPublisher) {
	const [publisher] = await connection.query("select * from unialfa.publisher where id_publisher = $1", [idPublisher]);
	publisher.idPublisher = `${publisher.id_publisher}`;
	return publisher;
}

exports.saveBook = async function (book) {
	if (book.publisher) {
		const [publisher] = await connection.query("insert into unialfa.publisher (name) values ($1) returning *", [book.publisher.name]);
		publisher.idPublisher = `${publisher.id_publisher}`;
		book.idPublisher = publisher.idPublisher;
	}
	const [savedBook] = await connection.query("insert into unialfa.book (title, price, pages, id_publisher, category) values ($1, $2, $3, $4, $5) returning *", [book.title, book.price, book.pages, book.idPublisher, book.category]);
	if (book.authors) {
		for (const author of book.authors) {
			const [savedAuthor] = await connection.query("insert into unialfa.author (name) values ($1) returning *", [author.name]);
			await connection.query("insert into unialfa.book_author (id_book, id_author) values ($1, $2)", [savedBook.id_book, savedAuthor.id_author]);
		}
	}
	savedBook.idBook = `${savedBook.id_book}`;
	return savedBook;
}

exports.deleteBook = async function (idBook) {
	await connection.query("delete from unialfa.book_author where id_book = $1", [idBook]);
	await connection.query("delete from unialfa.book where id_book = $1", [idBook]);
}
