const books = [
	{
		idBook: "1",
		idPublisher: "1",
		title: "Clean Code",
		category: "TECHNOLOGY",
		price: 59.90
	},
	{
		idBook: "2", 
		idPublisher: "1",
		title: "Patterns of Enterprise Application Architecture",
		category: "TECHNOLOGY",
		price: 89.90
	},
	{
		idBook: "3", 
		idPublisher: "2",
		title: "Design Patterns",
		category: "TECHNOLOGY",
		price: 99.90
	}
];

const authors = [
	{
		idAuthor: "1",
		name: "Robert Martin"
	},
	{
		idAuthor: "2",
		name: "Martin Fowler"
	},
	{
		idAuthor: "3",
		name: "Vaughn Vernon"
	},
	{
		idAuthor: "4",
		name: "Erich Gamma"
	},
	{
		idAuthor: "5",
		name: "Richard Helm"
	},
	{
		idAuthor: "6",
		name: "Ralph Johnson"
	},
	{
		idAuthor: "7",
		name: "John Vlissides"
	}
];

const bookAuthors = [
	{
		idBook: "1",
		idAuthor: "1"
	},
	{
		idBook: "2",
		idAuthor: "2"
	},
	{
		idBook: "3",
		idAuthor: "4"
	},
	{
		idBook: "3",
		idAuthor: "5"
	},
	{
		idBook: "3",
		idAuthor: "6"
	},
	{
		idBook: "3",
		idAuthor: "7"
	}
];

const publishers = [
	{
		idPublisher: "1",
		name: "Addison-Wesley"
	},
	{
		idPublisher: "2",
		name: "Manning"
	},
	{
		idPublisher: "3",
		name: "Pragmatic"
	}
]

exports.getBooks = function () {
	return books;
}

exports.getBooksByTitle = function (title) {
	return books.filter(book => book.title.includes(title));
}

exports.getAuthors = function () {
	return authors;
}

exports.getAuthorsByName = function (name) {
	return authors.filter(author => author.name.includes(name));
}

exports.getAuthorsByIdBook = function (idBook) {
	const bookAuthorsID = bookAuthors
		.filter(bookAuthor => bookAuthor.idBook === idBook)
		.map(bookAuthor => bookAuthor.idAuthor);
	return authors.filter(author => bookAuthorsID.includes(author.idAuthor));
}

exports.getPublisher = function (idPublisher) {
	return publishers.find(publisher => publisher.idPublisher === idPublisher);
}

exports.saveBook = function (book) {
	book.idBook = books.length + 1;
	if (book.publisher) {
		const publisher = book.publisher;
		publisher.idPublisher = publishers.length + 1;
		publishers.push(publisher);
		book.idPublisher = publisher.idPublisher;
	}
	if (book.authors) {
		for (const author of book.authors) {
			author.idAuthor = authors.length + 1;
			authors.push(author);
			bookAuthors.push({
				idBook: book.idBook,
				idAuthor: author.idAuthor
			});
		}
	}
	books.push(book);
	return book;
}

exports.deleteBook = function (idBook) {
	const book = books.find(book => book.idBook === idBook);
	const position = books.indexOf(book);
	books.splice(position, 1);
	return book;
}
