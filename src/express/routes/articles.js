'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const articleController = require(`../controllers/article-controller`);
const articleCategoryController = require(`../controllers/article-category-controller`);

articlesRouter.get(`/add`, articleController.create);
articlesRouter.get(`/:id`, articleController.show);
articlesRouter.get(`/edit/:id`, articleController.edit);
articlesRouter.get(`/category/:id`, articleCategoryController.show);

module.exports = articlesRouter;
