'use strict';

const express = require('express');
const knex = require('../knex.js');
const humps = require('humps');

const Books = require('../controllers/booksLookup.js')

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

  if (isNaN(id)) {
    return res.sendStatus(404);
  }

  let promiseFromQuery = books.querySingleBook(id);

  promiseFromQuery
    .then(book => {
      if (!book[0]) {
        res.sendStatus(404);
      } else {
        var camelized = humps.camelizeKeys(book);
        res.send(camelized[0]);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post('/books', (req, res) => {

  let books = new Books();
  let book = req.body;

  if (!book.title) {
    res.set('Content-Type','text/plain');
    res.status(400).send('Title must not be blank');
    return;
  }

  else if (!book.author) {
    res.set('Content-Type','text/plain');
    res.status(400).send('Author must not be blank');
    return;
  }

  else if (!book.genre) {
    res.set('Content-Type','text/plain');
    res.status(400).send('Genre must not be blank');
    return;
  }

  else if (!book.description) {
    res.set('Content-Type','text/plain');
    res.status(400).send('Description must not be blank');
    return;
  }

  else if (!book.coverUrl) {
    res.set('Content-Type','text/plain');
    res.status(400).send('Cover URL must not be blank');
    return;
  }

  else {

    let promiseFromQuery = books.addBook(book);

    promiseFromQuery
    .then(book => {
      var camelized = humps.camelizeKeys(book);
      res.setHeader('Content-Type', 'application/json')
      return res.send(camelized[0]);
    })
    .catch(err => {
      res.sendStatus(500);
    });

  }

});

router.patch('/books/:id', (req, res) => {
  let books = new Books();
  let book = req.body;
  let id = req.params.id;

  if (isNaN(id)) {
    return res.sendStatus(404);
  }

  let promiseFromQuery = books.updateBook(id, book);

  if (!promiseFromQuery._single.update.title) {
    return res.sendStatus(404);
  }


  promiseFromQuery
    .then((book) => {
      var camelized = humps.camelizeKeys(book);
      res.send(camelized[0])
      })
      .catch(err => {
        res.sendStatus(500);
      });
    });

router.delete('/books/:id', (req, res) => {
  let books = new Books();
  let id = req.params.id;

  if (isNaN(id)) {
    return res.sendStatus(404);
  }

  let promiseFromQuery = books.deleteBook(id);

  promiseFromQuery
    .then((book) => {
      if (!book[0]) {
        res.sendStatus(404);
      } else {
        var camelized = humps.camelizeKeys(book[0]);
        delete camelized.id;
        res.send(camelized);
      }
  })
    .catch(err => {
      res.status(500).send(err);
  });
});

module.exports = router;
