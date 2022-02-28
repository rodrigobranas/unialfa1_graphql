const { ApolloServer } = require("apollo-server");
const bookService = require("./bookServiceDatabase");
const videoService = require("./videoService");

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
		books (title: String): [Book]
		videos (title: String): [Video]
		contents: [SearchResult]
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
		async books(parent, args) {
			if (args.title) {
				const books = bookService.getBooksByTitle(args.title);
				return books;
			}
			return await bookService.getBooks();
		},
		videos(parent, args) {
			if (args.title) {
				return videoService.getVideosByTitle(args.title);
			}
			return videoService.getVideos();
		},
		async contents(parent, args) {
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
		authors(parent, args) {
			if (args.name) {
				return bookService.getAuthorsByName(args.name);
			}
			return bookService.getAuthors();
		}
	},
	Book: {
		price(parent, args) {
			if (args.locale && args.currency) {
				const formatter = new Intl.NumberFormat(args.locale, { style: "currency", currency: args.currency });
				const formattedPrice = formatter.format(parent.price);
				return formattedPrice;
			}
			return parent.price;
		},
		authors(parent) {
			return bookService.getAuthorsByIdBook(parent.idBook);
		},
		publisher(parent) {
			return bookService.getPublisher(parent.idPublisher);
		}
	},
	Mutation: {
		async saveBook1(parent, args) {
			const book = args;
			const savedBook = await bookService.saveBook(book);
			return savedBook;
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

const server = new ApolloServer({ typeDefs, resolvers, formatError: (err) => {
	console.log(err);
    return err;
  } 
});
server.listen(3000);
