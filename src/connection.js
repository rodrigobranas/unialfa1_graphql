const pgp = require("pg-promise");

module.exports = pgp()("postgres://postgres:123456@localhost:5432/app");
