'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const mainController = require(`../controllers/mainController`);

mainRouter.get(`/`, mainController.index);
mainRouter.get(`/search`, mainController.showSearch);
mainRouter.get(`/login`, mainController.showLogin);
mainRouter.get(`/register`, mainController.showRegister);

module.exports = mainRouter;
