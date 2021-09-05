'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const myController = require(`../controllers/my-controller`);
const admin = require(`../middlewares/admin`);

myRouter.get(`/`, [admin], myController.showMy);
myRouter.get(`/comments`, [admin], myController.showComments);

module.exports = myRouter;
