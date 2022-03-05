const connection = require("../src/connection");

test("Deve conectar com o banco de dados", async function () {
	const books = await connection.query("select * from unialfa.book", []);
	expect(books).toHaveLength(6);
});
