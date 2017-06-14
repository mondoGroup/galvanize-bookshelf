'use strict';

const express = require('express');
const knex = require('../knex.js');
const humps = require('humps');

const Books = require('./sql-classes.js')

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res) => {
  let books = new Books();

  let promiseFromQuery = books.queryAllBooks();

  promiseFromQuery
    .then(books => {
      var camelized = humps.camelizeKeys(books)
      res.send(camelized);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get('/books/:id', (req, res) => {
  let books = new Books();
  let id = req.params.id;

  let promiseFromQuery = books.querySingleBook(id);

  promiseFromQuery
    .then(book => {
      var camelized = humps.camelizeKeys(book);
      res.send(camelized[0]);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post('/books', (req, res) => {
  let books = new Books();
  let book = req.body;
  let promiseFromQuery = books.addBook(book);
  promiseFromQuery
    .then(book => {
      console.log(book);
      var camelized = humps.camelizeKeys(book);
      res.send(camelized[0]);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.delete('/books/:id', (req, res) => {
  let books = new Books();
  var book = req.body;
  let id = req.params.id

  let promiseFromQuery = books.deleteBook(id);

  promiseFromQuery
  .then((book) => {
    delete book.id;
    res.json(book);
  })
  .catch(err => {
    res.status(500).send(err);
  });
})

module.exports = router;
