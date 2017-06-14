'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
const humps = require('humps');

// YOUR CODE HERE

router.post('/users', (req, res, next) => {
  let user = req.body;

  bcrypt.hash(user.password, 9).then(function(hashed_password) {

    user.hashed_password = hashed_password;

    return knex('users')
      .insert({
        first_name: user.firstName,
        last_name: user.lastName,
        email: req.body.email,
        hashed_password: hashed_password
      }, ['email', 'first_name', 'last_name', 'id']);
    })
    .then((user) => {
      user = humps.camelizeKeys(user);
      res.send(user[0]);
    })
    .catch((err) => {
      next(err);
    });
  });

module.exports = router;
