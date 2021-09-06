'use strict';

const {UserRole} = require(`../../constants`);

const {Router} = require(`express`);
const myRouter = new Router();
const myController = require(`../controllers/my-controller`);
const checkRoles = require(`../middlewares/check-roles`);

myRouter.get(`/`, [checkRoles(UserRole.ADMIN)], myController.showMy);
myRouter.get(`/comments`, [checkRoles(UserRole.ADMIN)], myController.showComments);

module.exports = myRouter;
