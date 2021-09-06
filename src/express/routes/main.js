'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {uploader} = require(`../services/uploader`);
const mainController = require(`../controllers/main-controller`);
const csrfProtection = require(`csurf`)();

mainRouter.get(`/`, mainController.showMain);
mainRouter.get(`/search`, mainController.showSearch);
mainRouter.get(`/login`, mainController.showLogin);
mainRouter.post(`/login`, mainController.loginUser);
mainRouter.get(`/register`, csrfProtection, mainController.showRegister);
mainRouter.post(`/register`, [uploader.single(`avatar`), csrfProtection], mainController.registerUser);
mainRouter.get(`/logout`, mainController.logout);

module.exports = mainRouter;
