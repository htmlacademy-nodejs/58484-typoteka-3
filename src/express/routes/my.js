'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const myController = require(`../controllers/myController`);

myRouter.get(`/`, myController.index);
myRouter.get(`/comments`, myController.showComments);

module.exports = myRouter;
