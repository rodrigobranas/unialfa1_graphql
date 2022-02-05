const axios = require("axios");

test("Deve testar uma consulta de books com title", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					books {
						title
					}
				}
			`
		}
	});
	const query = response.data;
	const books = query.data.books;
	const [book1, book2, book3] = books;
	expect(book1.title).toBe("Clean Code");
	expect(book2.title).toBe("Patterns of Enterprise Application Architecture");
	expect(book3.title).toBe("Design Patterns");
});

test("Deve testar uma consulta de books com title e authors com name", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					books {
						title
						authors {
							name
						}
					}
				}
			`
		}
	});
	const query = response.data;
	const books = query.data.books;
	const [book1, book2, book3] = books;
	const [author1, author2, author3, author4] = book3.authors;
	expect(author1.name).toBe("Erich Gamma");
	expect(author2.name).toBe("Richard Helm");
	expect(author3.name).toBe("Ralph Johnson");
	expect(author4.name).toBe("John Vlissides");
});

test("Deve testar uma busca de livro pelo title", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					books (title: "Clean Code") {
						title
					}
				}
			`
		}
	});
	const query = response.data;
	const books = query.data.books;
	expect(books).toHaveLength(1);
	const [book1] = books;
	expect(book1.title).toBe("Clean Code");
});

test("Deve testar uma busca de autor pelo nome", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					authors (name: "Robert Martin") {
						name
					}
				}
			`
		}
	});
	const query = response.data;
	const authors = query.data.authors;
	expect(authors).toHaveLength(1);
	const [author1] = authors;
	expect(author1.name).toBe("Robert Martin");
});

test("Deve testar uma mutação para inserir um livro 1", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				mutation {
					saveBook1 (title: "Microservices Patterns", price: 89.90, category: "TECHNOLOGY") {
						idBook
						title
						price
						category
					}
				}
			`
		}
	});
	const query = response.data;
	const saveBook = query.data.saveBook;
	const response2 = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					books {
						title
					}
				}
			`
		}
	});
	const query2 = response2.data;
	const books = query2.data.books;
	const [book1, book2, book3, book4] = books;
	expect(book4.title).toBe("Microservices Patterns");
});

test.only("Deve testar uma mutação para inserir um livro 2", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				mutation {
					saveBook2 (book: {
						title: "Microservices Patterns", 
						price: 89.90, 
						category: "TECHNOLOGY",
						authors: [
							{
								name: "Cris Richardson"
							}
						],
						publisher: {
							name: "Addison-Wesley"
						}
					}) {
						idBook
						title
						price
						category
					}
				}
			`
		}
	});
	const query = response.data;
	const saveBook = query.data.saveBook;
	const response2 = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			query: `
				{
					books {
						title
						authors {
							name
						}
						publisher {
							name
						}
					}
				}
			`
		}
	});
	const query2 = response2.data;
	const books = query2.data.books;
	const [book1, book2, book3, book4] = books;
	console.log(book4);
	expect(book4.title).toBe("Microservices Patterns");
});