'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    article.comments.push(newComment);

    return newComment;
  }

  findAll(article) {
    return article.comments;
  }

  findOne(article, commentId) {
    return article.comments.find(({id}) => id === commentId);
  }

  drop(article, commentId) {
    const dropComment = this.findOne(article, commentId);
    article.comments = article.comments.filter(({id}) => id !== commentId);

    return dropComment;
  }
}

module.exports = CommentService;
