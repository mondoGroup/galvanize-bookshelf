'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');

// YOUR CODE HERE

router.post('/users', (req, res, next) => {
  let user = req.body;
  if (!user.email) {
    res.set('Content-Type','text/plain')
    return res.status(400).send('Email must not be blank')
  } else if (!user.password) {
    res.set('Content-Type','text/plain')
    return res.status(400).send('Password must be at least 8 characters long')
  }

  let promiseFromQuery = knex('users')
    .first()
    .where('email', user.email);

  promiseFromQuery
    .then((user) => {
      if (user) {
        res.set('Content-Type','text/plain')
        return res.status(400).send('Email already exists')
      }
    })

  bcrypt.hash(user.password, 9).then(function(hashed_password) {

    user.hashed_password = hashed_password;

    return knex('users')
      .insert({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        hashed_password: hashed_password
      }, ['email', 'first_name', 'last_name', 'id']);
    })
    .then((user) => {
      user = humps.camelizeKeys(user);
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

    	  res.cookie('token', token, {httpOnly: true}).send(user[0]);
    })
    .catch((err) => {
      next(err);
    });

  });

module.exports = router;
