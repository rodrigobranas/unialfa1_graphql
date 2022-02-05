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
