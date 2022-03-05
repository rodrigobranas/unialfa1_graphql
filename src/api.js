const { ApolloServer } = require("apollo-server");
const bookService = require("./bookServiceDatabase");
const videoService = require("./videoService");
const authService = require("./authServiceDatabase");

const typeDefs = `

	interface Content {
		title: String!
	}

	enum Category {
		TECHNOLOGY
		SCIENCE
		ENTERTAINMENT
	}

	type Book implements Content {
		idBook: ID
		title: String!
		price (locale: String, currency: String): String!
		pages: Int
		category: Category!
		authors (max: Int): [Author]
		publisher: Publisher
	}

	type Video implements Content {
		idVideo: ID
		title: String!
		length: Int
	}

	type Author {
		idAuthor: ID
		name: String!
	}

	type Publisher {
		idPublisher: ID
		name: String!
	}

	union SearchResult = Book | Video

	type Query {
		books (title: String, limit: Int, offset: Int): [Book]
		videos (title: String): [Video]
		contents: [SearchResult]
		authors (name: String): [Author]
	}

	input BookInput {
		title: String!
		price: Float!
		category: String!
		pages: Int
		authors: [AuthorInput]
		publisher: PublisherInput
	}

	input AuthorInput {
		name: String!
	}

	input PublisherInput {
		name: String!
	}

	input AuthInput {
		email: String
		password: String
	}

	type Session {
		token: String
	}

	type Mutation {
		saveBook1 (title: String!, price: Float!, category: String!): Book
		saveBook2 (book: BookInput): Book
		deleteBook (idBook: ID): Book
		login (auth: AuthInput): Session
	}
`;

const resolvers = {
	Query: {
		async books(parent, args, context) {
			if (!context.user.idUser) return;
			if (args.title) {
				return bookService.getBooksByTitle(args.title);
			}
			if (args.limit) {
				return bookService.getBooksWithPagination(args.limit, args.offset);
			}
			return await bookService.getBooks();
		},
		videos(parent, args, context) {
			if (!context.user.idUser) return;
			if (args.title) {
				return videoService.getVideosByTitle(args.title);
			}
			return videoService.getVideos();
		},
		async contents(parent, args, context) {
			if (!context.user.idUser) return;
			const books = await bookService.getBooks();
			for (const book of books) {
				book.__typename = "Book";
			}
			const videos = videoService.getVideos();
			for (const video of videos) {
				video.__typename = "Video";
			}
			const contents = [...books, ...videos];
			return contents;
		},
		authors(parent, args, context) {
			if (!context.user.idUser) return;
			if (args.name) {
				return bookService.getAuthorsByName(args.name);
			}
			return bookService.getAuthors();
		}
	},
	Book: {
		price(parent, args, context) {
			if (!context.user.idUser) return;
			if (args.locale && args.currency) {
				const formatter = new Intl.NumberFormat(args.locale, { style: "currency", currency: args.currency });
				const formattedPrice = formatter.format(parent.price);
				return formattedPrice;
			}
			return parent.price;
		},
		authors(parent, args, context) {
			if (!context.user.idUser) return;
			return bookService.getAuthorsByIdBook(parent.idBook);
		},
		publisher(parent, args, context) {
			if (!context.user.idUser) return;
			return bookService.getPublisher(parent.idPublisher);
		}
	},
	Mutation: {
		async saveBook1(parent, args, context) {
			if (!context.user.idUser) return;
			const book = args;
			const savedBook = await bookService.saveBook(book);
			return savedBook;
		},
		saveBook2(parent, args, context) {
			if (!context.user.idUser) return;
			const book = args.book;
			return bookService.saveBook(book);
		},
		deleteBook(parent, args, context) {
			if (!context.user.idUser) return;
			return bookService.deleteBook(args.idBook);
		},
		async login (parent, args, context) {
			const auth = args.auth;
			const user = await authService.getUser(auth.email, auth.password);
			if (user) {
				return {
					token: "Bearer 123456"
				}
			} else {
				return {};
			}
		}
	}
};

const server = new ApolloServer({
	typeDefs, 
	resolvers, 
	context: ({ req }) => {
		if (req.headers.authorization === "Bearer 123456") {
			return { user: { idUser: 1000 }}
		} else {
			return {};
		}
	}, 
	formatError: (err) => {
		console.log(err);
    	return err;
  	} 
});
server.listen(3000);
