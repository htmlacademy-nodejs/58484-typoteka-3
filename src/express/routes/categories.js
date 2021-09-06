'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const categoryController = require(`../controllers/category-controller`);
const checkRoles = require(`../middlewares/check-roles`);
const {UserRole} = require(`../../constants`);
const csrfProtection = require(`csurf`)();

categoriesRouter.get(`/`, [checkRoles(UserRole.ADMIN), csrfProtection], categoryController.showCategories);
categoriesRouter.post(`/`, [checkRoles(UserRole.ADMIN), csrfProtection], categoryController.storeCategory);
categoriesRouter.post(`/edit/:id`, [checkRoles(UserRole.ADMIN), csrfProtection], categoryController.updateCategory);
categoriesRouter.post(`/:id`, [checkRoles(UserRole.ADMIN)], categoryController.deleteCategory);

module.exports = categoriesRouter;
