const knex = require('../knex.js');
const humps = require('humps');
const bcrypt = require('bcrypt');


class Users {
	constructor(){

	}

	getUserName(email){
		return knex('users').first().where('email', email)
	}

	tryLoginUser(email, password){
		return knex('users').select('password').first().where({email})
		.then(queryResult => {
			let hashed = queryResult.hashed_password;
			return bcrypt.compare(password, hashed_password);
	})
	}
}
module.exports = Users;
