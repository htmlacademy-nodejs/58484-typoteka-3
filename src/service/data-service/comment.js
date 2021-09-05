'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      userId: global.user.id,
      ...comment
    });
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
      nest: true,
      include: {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`password`]
        }
      }
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

  async getLastComments(limit) {
    return this._Comment.findAll({
      include: {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`password`]
        }
      },
      order: [[`created_at`, `DESC`]],
      limit
    });
  }

}

module.exports = CommentService;
