'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const categoryController = require(`../controllers/category-controller`);
const checkRoles = require(`../middlewares/check-roles`);
const {UserRole} = require(`../../constants`);
const csrfProtection = require(`csurf`)();

categoriesRouter.get(`/`, [checkRoles(UserRole.ADMIN), csrfProtection], categoryController.showCategories);
// TODO: Добавить возможность создавать и редактировать категории

module.exports = categoriesRouter;
