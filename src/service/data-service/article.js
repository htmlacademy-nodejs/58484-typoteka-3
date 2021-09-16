'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create({
      ...articleData,
      userId: global.user.id
    });
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push(Alias.COMMENTS);
    }
    const articles = await this._Article.findAll({
      include,
      order: [[`created_at`, `DESC`]],
    });
    return articles.map((item) => item.get());
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      distinct: true,
      order: [[`created_at`, `DESC`]],
    });
    return {count, articles: rows};
  }

  findOne(id, needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    return this._Article.findByPk(id, {include});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    const updatedArticle = await this._Article.findByPk(id);
    await updatedArticle.setCategories(article.categories);

    return !!affectedRows;
  }

  async findArticlesByCategoryId({categoryId, limit, offset}) {
    const category = await this._Category.findByPk(categoryId);

    const [count, articles] = await Promise.all([
      category.countArticles(),
      category.getArticles({
        limit, offset,
        nest: true,
        include: [Alias.CATEGORIES, Alias.COMMENTS],
      })
    ]);

    return {count, articles};
  }

  async getHotArticles(limit) {
    return await this._Article.findAll({
      include: [{
        model: this._Comment,
        as: Alias.COMMENTS,
        attributes: [],
        duplicating: false
      }],
      attributes: [
        `id`,
        `announce`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `comments_count`]
      ],
      group: [Sequelize.col(`Article.id`)],
      order: [[Sequelize.literal(`comments_count`), `DESC`]],
      limit
    });
  }

}

module.exports = ArticleService;
