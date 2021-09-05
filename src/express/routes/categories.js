'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const categoryController = require(`../controllers/category-controller`);
const admin = require(`../middlewares/admin`);
const csrfProtection = require(`csurf`)();

categoriesRouter.get(`/`, [admin, csrfProtection], categoryController.showCategories);
// TODO: Добавить возможность создавать и редактировать категории

module.exports = categoriesRouter;
