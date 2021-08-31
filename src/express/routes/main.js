'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {uploader} = require(`../services/uploader`);
const mainController = require(`../controllers/main-controller`);


mainRouter.get(`/`, mainController.showMain);
mainRouter.get(`/search`, mainController.showSearch);
mainRouter.get(`/login`, mainController.showLogin);
mainRouter.get(`/register`, mainController.showRegister);
mainRouter.post(`/register`, uploader.single(`avatar`), mainController.registerUser);

module.exports = mainRouter;
