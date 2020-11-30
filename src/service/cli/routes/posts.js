'use strict';

const {Router} = require(`express`);
const postsController = require(`../controllers/post-controller`);
const postsRouter = new Router();

postsRouter.get(`/`, postsController.index);

module.exports = postsRouter;
