const bookServices = require("../src/bookServiceDatabase");

describe("Book Service Database", function () {
	test("Deve retornar uma lista de livros", async function () {
		const books = await bookServices.getBooks();
		expect(books).toHaveLength(6);
	});
	
	test("Deve retornar uma lista de autores", async function () {
		const authors = await bookServices.getAuthors();
		const [author1] = authors;
		expect(author1.name).toBe("Robert Martin");
	});
	
	test("Deve retornar os autores de um livro", async function () {
		const idBook = "3";
		const authors = await bookServices.getAuthorsByIdBook(idBook);
		expect(authors).toHaveLength(4);
	});
	
	test("Deve salvar um livro", async function () {
		const book = {
			title: "Micro Frontends in Action",
			price: 59,
			pages: 100,
			category: "TECHNOLOGY",
			authors: [
				{
					name: "Michael Geers"
				}
			],
			publisher: {
				name: "Manning"
			}
		};
		await bookServices.saveBook(book);
		const books = await bookServices.getBooksByTitle("Micro Frontends in Action");
		const [book1] = books;
		expect(book1.title).toBe("Micro Frontends in Action");
		expect(book1.price).toBe("59");
		expect(book1.pages).toBe(100);
		await bookServices.deleteBook(book1.idBook);
	});
	
	test("Deve apagar um livro", async function () {
		const book = {
			title: "Micro Frontends in Action",
			price: 59,
			pages: 100,
			category: "TECHNOLOGY",
			authors: [
				{
					name: "Michael Geers"
				}
			],
			publisher: {
				name: "Manning"
			}
		};
		await bookServices.saveBook(book);
		const booksBefore = await bookServices.getBooksByTitle("Micro Frontends in Action");
		const [book1] = booksBefore;
		expect(book1.title).toBe("Micro Frontends in Action");
		await bookServices.deleteBook(book1.idBook);
		const booksAfter = await bookServices.getBooksByTitle("Micro Frontends in Action");
		expect(booksAfter).toHaveLength(0);
	});
	
});
