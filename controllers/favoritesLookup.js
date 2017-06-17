const knex = require('../knex.js');
const humps = require('humps');

class Favorites {

  getAllFavoritesByUserId(userId) {
    let promiseFromQuery = knex('favorites')
    .innerJoin('books','books.id','favorites.book_id')
      .where('user_id', userId);

    return promiseFromQuery;
  }

  getFavoriteByBookId(userId, bookId) {
    let promiseFromQuery = knex('favorites')
      .where('user_id', userId)
      .andWhere('book_id', bookId);
    return promiseFromQuery;
  }

  addFavoriteByBookId(userId, bookId) {
    let promiseFromQuery = knex('favorites')
      .insert({ user_id: userId,
                book_id: bookId}, ['id','user_id','book_id']);
    return promiseFromQuery;
  }

  deleteFavoriteByBookId(userId, bookId) {
    let promiseFromQuery = knex('favorites')
      .del()
      .where('book_id', bookId)
      .andWhere('user_id', userId)
      .returning(['user_id','book_id']);

    return promiseFromQuery;
  }

}

module.exports = Favorites;
