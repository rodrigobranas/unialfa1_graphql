const bookServices = require("../src/bookService");

test("Deve retornar uma lista de livros", function () {
	const books = bookServices.getBooks();
	expect(books).toHaveLength(3);
});

test("Deve retornar uma lista de autores", function () {
	const authors = bookServices.getAuthors();
	expect(authors).toHaveLength(7);
});

test("Deve retornar os autores de um livro", function () {
	const idBook = "3";
	const authors = bookServices.getAuthorsByIdBook(idBook);
	expect(authors).toHaveLength(4);
});

test("Deve salvar um livro", function () {
	const book = {
		title: "Micro Frontends in Action",
		price: 59,
		pages: 100,
		authors: [
			{
				name: "Michael Geers"
			}
		],
		publisher: {
			name: "Manning"
		}
	};
	bookServices.saveBook(book);
	const books = bookServices.getBooksByTitle("Micro Frontends in Action");
	const [book1] = books;
	expect(book1.title).toBe("Micro Frontends in Action");
	expect(book1.price).toBe(59);
	expect(book1.pages).toBe(100);
	const [author1] = book.authors;
	expect(author1.name).toBe("Michael Geers");
	expect(book1.publisher.name).toBe("Manning");
	bookServices.deleteBook(book1.idBook);
});

test("Deve apagar um livro", function () {
	const book = {
		title: "Micro Frontends in Action",
		price: 59,
		pages: 100,
		authors: [
			{
				name: "Michael Geers"
			}
		],
		publisher: {
			name: "Manning"
		}
	};
	bookServices.saveBook(book);
	const booksBefore = bookServices.getBooksByTitle("Micro Frontends in Action");
	const [book1] = booksBefore;
	expect(book1.title).toBe("Micro Frontends in Action");
	bookServices.deleteBook(book1.idBook);
	const booksAfter = bookServices.getBooksByTitle("Micro Frontends in Action");
	expect(booksAfter).toHaveLength(0);
});
