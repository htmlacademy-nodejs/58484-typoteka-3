'use strict';

const {Router} = require(`express`);

const {
  category,
  article,
  search,
  user,
  comment,
} = require(`../api`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/define`);

const apiRoutes = new Router();

defineModels(sequelize);

(() => {
  category(apiRoutes, new CategoryService(sequelize));
  article(apiRoutes, new ArticleService(sequelize), new CommentService(sequelize));
  search(apiRoutes, new SearchService(sequelize));
  user(apiRoutes, new UserService(sequelize));
  comment(apiRoutes, new CommentService(sequelize));
})();

module.exports = apiRoutes;
