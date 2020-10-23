'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const categoryController = require(`../controllers/categoryController`);

categoriesRouter.get(`/`, categoryController.index);

module.exports = categoriesRouter;
