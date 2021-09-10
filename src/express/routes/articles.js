'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const articleController = require(`../controllers/article-controller`);
const articleCategoryController = require(`../controllers/article-category-controller`);
const articleCommentController = require(`../controllers/article-comment-controller`);
const {uploader} = require(`../services/uploader`);
const auth = require(`../middlewares/auth`);
const checkRoles = require(`../middlewares/check-roles`);
const {UserRole} = require(`../../constants`);
const csrfProtection = require(`csurf`)();

articlesRouter.post(`/add`, [uploader.single(`upload`), csrfProtection], articleController.store);
articlesRouter.get(`/add`, [auth, checkRoles(UserRole.ADMIN), csrfProtection], articleController.create);
articlesRouter.get(`/:id`, [csrfProtection], articleController.show);
articlesRouter.post(`/edit/:id`, [uploader.single(`upload`), csrfProtection], articleController.update);
articlesRouter.get(`/edit/:id`, [checkRoles(UserRole.ADMIN), csrfProtection], articleController.edit);
articlesRouter.get(`/category/:id`, articleCategoryController.show);
articlesRouter.post(`/:id/comments`, [csrfProtection], articleCommentController.store);
articlesRouter.post(`/:id`, articleController.destroy);

module.exports = articlesRouter;
