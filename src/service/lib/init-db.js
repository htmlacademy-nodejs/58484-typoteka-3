'use strict';

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, data) => {
  const {users, categories, articles, roles} = data;
  const {Category, User, Role, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = Category.bulkCreate(
      categories.map((title) => ({title}))
  );

  const roleModels = Role.bulkCreate(
      roles.map(({title}) => ({title}))
  );

  const userModels = User.bulkCreate(
      users.map((user) => user)
  );

  await Promise.all([
    categoryModels,
    roleModels,
    userModels
  ]);

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(article.categories);
  });

  await Promise.all(articlePromises);
};
