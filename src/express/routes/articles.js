'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const articleController = require(`../controllers/articleController`);
const articleCategoryController = require(`../controllers/articleCategoryController`);

articlesRouter.get(`/:id`, articleController.show);
articlesRouter.get(`/edit/:id`, articleController.edit);
articlesRouter.get(`/add`, articleController.create);
articlesRouter.get(`/category/:id`, articleCategoryController.show);

module.exports = articlesRouter;
