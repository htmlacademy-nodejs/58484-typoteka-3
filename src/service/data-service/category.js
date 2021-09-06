'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `title`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`article_category.article_id`)
            ),
            `count`
          ]
        ],
        having: Sequelize.literal(`count(article_category.article_id) > 0`),
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORY,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    } else {
      return await this._Category.findAll({
        raw: true
      });
    }
  }

  async create({category}) {
    return await this._Category.create({
      title: category
    });
  }

  async update(id, {category}) {
    return await this._Category.update({
      title: category
    }, {
      where: {id},
    });
  }

  async delete(id) {
    return await this._Category.destroy({
      where: {id}
    });
  }

  async hasArticles(id) {
    const category = await this._Category.findByPk(id);

    return Boolean(category && await category.countArticles());
  }
}

module.exports = CategoryService;
