const { ApolloServer } = require("apollo-server");
const bookService = require("./bookService");

const typeDefs = `

	enum Category {
		TECHNOLOGY
		SCIENCE
		ENTERTAINMENT
	}

	type Book {
		idBook: ID
		title: String!
		price: Float!
		pages: Int
		category: Category!
		authors: [Author]
		publisher: Publisher
	}

	type Author {
		idAuthor: ID
		name: String!
	}

	type Publisher {
		idPublisher: ID
		name: String!
	}

	type Query {
		books (title: String): [Book]
		authors (name: String): [Author]
	}

	input BookInput {
		title: String!
		price: Float!
		category: String!
		authors: [AuthorInput]
		publisher: PublisherInput
	}

	input AuthorInput {
		name: String!
	}

	input PublisherInput {
		name: String!
	}

	type Mutation {
		saveBook1 (title: String!, price: Float!, category: String!): Book
		saveBook2 (book: BookInput): Book
		deleteBook (idBook: ID): Book
	}
`;

const resolvers = {
	Query: {
		books(parent, args) {
			if (args.title) {
				const books = bookService.getBooksByTitle(args.title);
				return books;
			}
			return bookService.getBooks();
		},
		authors(parent, args) {
			if (args.name) {
				return bookService.getAuthorsByName(args.name);
			}
			return bookService.getAuthors();
		}
	},
	Book: {
		authors(parent) {
			return bookService.getAuthorsByIdBook(parent.idBook);
		},
		publisher(parent) {
			return bookService.getPublisher(parent.idPublisher);
		}
	},
	Mutation: {
		saveBook1(parent, args) {
			const book = args;
			return bookService.saveBook(book);
		},
		saveBook2(parent, args) {
			const book = args.book;
			return bookService.saveBook(book);
		},
		deleteBook(parent, args) {
			return bookService.deleteBook(args.idBook);
		}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(3000);
