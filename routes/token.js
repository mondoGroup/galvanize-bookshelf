'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


// eslint-disable-next-line new-cap
const router = express.Router();
const Users = require('../controllers/userLookup');
const users = new Users();
const humps = require('humps');


// router.get() {}

router.post('/token', checkUser, (req, res)=>{
	let user=req.user;
	user = humps.camelizeKeys(user);

	let userObj = {
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		id: user.id
	};

	const jwtPayload = {
	    iss: 'jwt_lesson_app',
	    sub: {
	      email: user.email,
	      id: user.id
	    },
	    exp: Math.floor(Date.now() / 1000) + (60 * 60),
	    loggedIn: true
	  };

	  const secret = process.env.JWT_KEY;
	  const token = jwt.sign(jwtPayload, secret);

	  res.cookie('token', token, {httpOnly: true}).send(userObj);
})

// router.delete() {}

function checkUser(req,res,next){
	const {email, password} = req.body;
	users.getUserName(email)
	.then(user => {
		if(!user){
		res.status(404).send('User doesn\'t exist');
	} else{
		req.user=user;
		next();
	}
	})
	.catch(err => {
	})
}


// function tryUserLogin(req, res, next){
// 	const { email, password } = req.body;
//
// 	  users.tryLoginUser(email, password)
// 	    .then(loggedIn => {
// 	      if (!loggedIn) {
// 	        res.send('Incorrect Password');
// 	      } else {
// 	        next();
// 	      }
// 	    })
// 	    .catch(err => {
// 	      console.log(err);
// 	    });
// }

module.exports = router;
