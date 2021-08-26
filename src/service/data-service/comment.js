'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  create(articleId, comment) {
    const userId = 1; // temp! Use auth userId
    return this._Comment.create({
      articleId,
      userId,
      ...comment
    });
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
      nest: true,
      include: [Aliase.USER]
    });
  }

  findOne(id) {
    return this._Comment.findByPk(id);
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
