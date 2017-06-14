const knex = require('../knex.js');
const humps = require('humps');

class Books {
  constructor() {
  }

  queryAllBooks() {
    let promiseFromQuery = knex('books')
    .orderBy('title');

    return promiseFromQuery;
  }

  querySingleBook(id) {
    let promiseFromQuery = knex('books')
      .where('id', id);

    return promiseFromQuery;
  }

  addBook(book) {
    let promiseFromQuery = knex('books')
      .insert({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        cover_url: book.coverUrl
      });

    return promiseFromQuery;

  }

  updateBook(id, book) {
    let promiseFromQuery = knex('books')
      .where('id', id)
      .update({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        cover_url: book.cover_url}, '*');

    return promiseFromQuery;
  }

  deleteBook(id) {
    let promiseFromQuery = knex('books')
      .where('id', id)
      .del();

    return promiseFromQuery;
  }


}

module.exports = Books;
