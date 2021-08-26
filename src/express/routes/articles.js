'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const articleController = require(`../controllers/article-controller`);
const articleCategoryController = require(`../controllers/article-category-controller`);
const articleCommentController = require(`../controllers/article-comment-controller`);
const {uploader} = require(`../services/uploader`);

articlesRouter.post(`/add`, uploader.single(`upload`), articleController.store);
articlesRouter.get(`/add`, articleController.create);
articlesRouter.get(`/:id`, articleController.show);
articlesRouter.post(`/edit/:id`, uploader.single(`upload`), articleController.update);
articlesRouter.get(`/edit/:id`, articleController.edit);
articlesRouter.get(`/category/:id`, articleCategoryController.show);
articlesRouter.post(`/:id/comments`, articleCommentController.store);

module.exports = articlesRouter;
