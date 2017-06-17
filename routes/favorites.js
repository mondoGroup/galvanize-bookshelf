'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js');
const jwt = require('jsonwebtoken');
const Favorites = require('../controllers/favoritesLookup');
const favorites = new Favorites();
const humps = require('humps');

// YOUR CODE HERE

router.get('/favorites', checkUserLoggedIn, (req,res) => {
  let userId = req.userId;

  favorites.getAllFavoritesByUserId(userId)
    .then(favorites => {
      var camelized = humps.camelizeKeys(favorites);
      res.send(camelized);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  });

router.get('/favorites/check', checkUserLoggedIn, (req,res) => {
  let userId = req.userId;
  let bookId = req.query.bookId;

  favorites.getFavoriteByBookId(userId, bookId)
    .then(book => {
      if (!book[0]){
        res.send(false);
      } else {
        res.send(true);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
  });

router.post('/favorites', checkUserLoggedIn, (req, res) => {
  let userId = req.userId;
  let bookId = req.body.bookId;


  favorites.addFavoriteByBookId(userId, bookId)
    .then(record => {
      record = humps.camelizeKeys(record);
      res.send(record[0])
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);

    });
  });

router.delete('/favorites', checkUserLoggedIn, (req, res) => {

  let userId = req.userId;
  let bookId = req.body.bookId;

  favorites.deleteFavoriteByBookId(userId, bookId)
  .then(record => {
    record = humps.camelizeKeys(record);
    res.send(record[0])
  })
  .catch(err => {
    res.status(500).send(err);

  });
});

function checkUserLoggedIn(req, res, next) {
  if(!req.cookies.token){
    res.sendStatus(401);
  } else {
    let userObject = jwt.decode(req.cookies.token);
    let userId = userObject.sub.id;
    req.userId = userId;
    next();
  }
}

module.exports = router;
