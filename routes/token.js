'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// eslint-disable-next-line new-cap
const router = express.Router();
const Users = require('../controllers/userLookup');
const users = new Users();
const humps = require('humps');

router.get('/token', (req, res) => {
	if (!req.cookies.token) {
		res.send(false);
	} else {
		res.send(true);
	}
})

router.post('/token', checkUser, tryUserLogin, (req, res) => {
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

router.delete('/token',(req, res) => {
	res.cookie('token','').send(true);
})

function checkUser(req,res,next){
	const {email, password} = req.body;

	if(!email) {
		res.set('Content-Type','text/plain');
		return res.status(400).send('Email must not be blank');
	}

	users.getUserName(email)
	.then(user => {
		if(!user){
			res.set('Content-Type','text/plain');
			return res.status(400).send('Bad email or password');
	} else{
		req.user=user;
		next();
	}
	})
	.catch(err => {
		res.status(500).send(err);
	})
}

function tryUserLogin(req, res, next){
	const { email, password } = req.body;

	if(!password) {
		res.set('Content-Type','text/plain');
		return res.status(400).send('Password must not be blank');
	}

	  users.tryLoginUser(email, password)
	    .then(loggedIn => {
	      if (!loggedIn) {
					res.set('Content-Type','text/plain')
					res.status(400).send('Bad email or password')
	      } else {
	        next();
	      }
	    })
	    .catch(err => {
				res.status(500).send(err);
	    });
}

module.exports = router;
