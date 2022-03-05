<template>
	<div>
		<div v-if="token">
			<div class="row">
				<div class="col-md-8">
					<div class="books">
						<div class="book-bar">
							<div class="row">
								<div class="col-md-6">
									<input type="text" class="form-control" v-model="criteria" placeholder="Search" @keyup="search()"/>
								</div>
								<div class="col-md-6 text-right">
									<button v-for="c in currencies" v-bind:key="c.currency" class="btn btn-sm" v-bind:class="{ 'btn-info': currency === c.currency }" @click="changeCurrency(c.locale, c.currency)">{{ c.description }}</button>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4" v-for="book in books" v-bind:key="book.idBook">
								<div class="card card-default text-center book">
									<div class="book-title">
										{{ book.title }}
									</div>
									<div class="book-authors">
										<span v-for="(author, index) in book.authors" v-bind:key="index">
											<span>{{ author.name }}</span><span v-if="index !== book.authors.length - 1">, </span>
										</span>
									</div>
									<div class="book-publisher">
										{{ book.publisher.name }}
									</div>
									<div class="book-price">
										{{ book.price }}
									</div>
									<br/>
									<button class="btn btn-danger btn-sm" @click="deleteBook(book.idBook)">Delete</button>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<button class="btn btn-info" @click="previous()"><span class="fa fa-arrow-left"></span></button>
							</div>
							<div class="col-md-4 text-center">
								<input type="number" class="form-control page-size" v-model="limit" @blur="updatePageSize()"/>
							</div>
							<div class="col-md-4 text-right">
								<button class="btn btn-info" @click="next()"><span class="fa fa-arrow-right"></span></button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="new-book">
						<h5 @click="createBookDummy()">New Book</h5>
						<hr/>
						<div v-if="!savedBook.idBook">
							<div class="form-group">
								<label>Title</label>
								<input type="text" class="form-control" v-model="newBook.title"/>
							</div>
							<div class="form-group">
								<label>Category</label>
								<br/>
								<button v-for="c in categories" v-bind:key="c.name" class="btn btn-sm" v-bind:class="{ 'btn-info': newBook.category === c.name }" @click="changeCategory(c.name)">{{ c.name }}</button>
							</div>
							<div class="form-group">
								<label>Pages</label>
								<input type="number" class="form-control" v-model="newBook.pages"/>
							</div>
							<div class="form-group">
								<label>Price</label>
								<input type="number" class="form-control" v-model="newBook.price"/>
							</div>
							<div class="form-group">
								<label>Publisher</label>
								<input type="text" class="form-control" v-model="newBook.publisher.name"/>
							</div>
							<div class="row">
								<div class="col-md-6">
									<h5>Authors</h5>
								</div>
								<div class="col-md-6 text-right">
									<button class="btn btn-info btn-sm" @click="addAuthor()"><span class="fa fa-plus"></span></button>
								</div>
							</div>
							<hr/>
							<div v-for="(author, index) in newBook.authors" v-bind:key="index">
								<div class="form-group">
										<label>Author #{{ index + 1 }}</label>
									<div class="row">
										<div class="col-md-9">
											<input type="text" class="form-control" v-model="author.name"/>
										</div>
										<div class="col-md-3 text-right">
											<button class="btn btn-danger btn-sm" @click="deleteAuthor(author)"><span class="fa fa-trash"></span></button>
										</div>
									</div>
								</div>
							</div>
							<br/>
							<button class="btn btn-info" @click="save()">Save</button>
						</div>
						<div v-if="savedBook.idBook">
							<div class="text-center">
								<span class="fa fa-check fa-3x"></span>
								<br/>
								<br/>
								<br/>
								<span>Book Saved Successfully!</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!token">
				<div class="row">
					<div class="col-md-3"></div>
					<div class="col-md-6">
						<div class="login-form">
							<div class="form-group">
								<label>E-mail</label>
								<input type="text" class="form-control" v-model="auth.email"/>
							</div>
							<div class="form-group">
								<label>Password</label>
								<input type="password" class="form-control" v-model="auth.password"/>
							</div>
							<br/>
							<button class="btn btn-info btn-block" @click="login(auth)">Login</button>
						</div>
					</div>
				</div>
			</div>
	</div>
</template>

<script>

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/font-awesome/css/font-awesome.css";
import axios from "axios";

export default {
	name: "App",
	data() {
		return {
			books: [],
			newBook: {
				category: "TECHNOLOGY",
				publisher: {},
				authors: []
			},
			locale: "pt-BR",
			currency: "BRL",
			currencies: [
				{ locale: "pt-BR", currency: "BRL", description: "BRL" },
				{ locale: "en-US", currency: "USD", description: "USD" },
				{ locale: "es-ES", currency: "EUR", description: "EUR" }
			],
			limit: 3,
			offset: 0,
			criteria: "",
			categories: [{ name: "TECHNOLOGY" }, { name: "SCIENSE" }, { name: "ENTERTAINMENT" }],
			savedBook: {},
			auth: {
				email: "rodrigo@branas.io",
				password: "123456"
			},
			token: ""
		}
	},
	methods: {
		async loadBooks () {
			const response = await axios({
				url: "http://localhost:3000",
				method: "post",
				headers: {
					"content-type": "application/json",
					"authorization": this.token
				},
				data: {
					query: `
						query ($locale: String, $currency: String, $limit: Int, $offset: Int, $title: String) {
							books (title: $title, limit: $limit, offset: $offset) {
								idBook
								title
								price (locale: $locale, currency: $currency),
								authors {
									idAuthor
									name
								}
								publisher {
									name
								}
							}
						}
					`,
					variables: {
						title: this.criteria,
						limit: this.limit,
						offset: this.offset,
						locale: this.locale,
						currency: this.currency
					}
				}
			});
			const query = response.data;
			this.books = query.data.books;
		},
		async save () {
			const response = await axios({
				url: "http://localhost:3000",
				method: "post",
				headers: {
					"Content-Type": "application/json",
					"authorization": this.token
				},
				data: {
					query: `
						mutation ($book: BookInput) {
							saveBook2 (book: $book) {
								idBook
								title
								price
								category
							}
						}
					`,
					variables: {
						book: this.newBook
					}
				}
			});
			this.loadBooks();
			const query = response.data;
			this.savedBook = query.data.saveBook2;
			setTimeout(() => {
				this.newBook = {
					category: "TECHNOLOGY",
					publisher: {},
					authors: []
				}
				this.savedBook = {};
			}, 2000);
		},
		async deleteBook (idBook) {
			await axios({
				url: "http://localhost:3000",
				method: "post",
				headers: {
					"Content-Type": "application/json",
					"authorization": this.token
				},
				data: {
					query: `
						mutation ($idBook: ID) {
							deleteBook (idBook: $idBook) {
								idBook
								title
								price
								category
							}
						}
					`,
					variables: {
						idBook
					}
				}
			});
			this.loadBooks();
		},
		changeCurrency (locale, currency) {
			this.locale = locale;
			this.currency = currency;
			this.loadBooks();
		},
		previous () {
			if (this.offset === 0) return;
			this.offset--;
			this.loadBooks();
		},
		next () {
			this.offset++;
			this.loadBooks();
		},
		updatePageSize () {
			this.loadBooks();
		},
		search () {
			this.loadBooks();
		},
		changeCategory (category) {
			this.newBook.category = category;
		},
		addAuthor () {
			this.newBook.authors.push({});
		},
		deleteAuthor (author) {
			this.newBook.authors.splice(this.newBook.authors.indexOf(author), 1);
		},
		createBookDummy () {
			this.newBook = {
				title: "A",
				category: "TECHNOLOGY",
				price: 59,
				pages: 200,
				publisher: { name: "B" },
				authors: [ { name: "C" }, { name: "D" }]
			}
		},
		async login () {
			const response = await axios({
				url: "http://localhost:3000",
				method: "post",
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					query: `
						mutation ($auth: AuthInput) {
							login (auth: $auth) {
								token
							}
						}
					`,
					variables: {
						auth: this.auth
					}
				}
			});
			const query = response.data;
			const login = query.data.login;
			this.token = login.token;
			await this.loadBooks();
		}
	},
	async created() {
	}
};
</script>

<style>
.books {
	padding: 20px;
}

.book {
	padding: 10px;
	margin-bottom: 10px;
}

.book-bar {
	margin-bottom: 20px;
}

.book-bar .btn {
	margin-left: 10px;
}

.new-book {
	padding: 20px;
	background-color: #DDD;
	min-height: 100vh;
}

.book-title {
	font-size: 12px;
	font-weight: bold;
	height: 70px;
}

.book-authors {
	height: 70px;
	font-size: 11px;
}

.book-publisher {
	height: 50px;
	font-size: 11px;
}

.book-price {
	font-size: 14px;
	font-weight: bold;
	height: 30px;
}

.page-size {
	width: 60px;
}

.login-form {
	padding: 20px;
}
</style>