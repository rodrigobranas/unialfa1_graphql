const connection = require("./connection");

exports.getUser = async function (email, password) {
	const [user] = await connection.query("select * from unialfa.user where email = $1 and password = $2", [email, password]);
	return user;
}
