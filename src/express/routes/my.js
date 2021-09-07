'use strict';

const {UserRole} = require(`../../constants`);

const {Router} = require(`express`);
const myRouter = new Router();
const myController = require(`../controllers/my-controller`);
const checkRoles = require(`../middlewares/check-roles`);
const csrfProtection = require(`csurf`)();

myRouter.get(`/`, [checkRoles(UserRole.ADMIN)], myController.showMy);
myRouter.get(`/comments`, [csrfProtection, checkRoles(UserRole.ADMIN)], myController.showComments);
myRouter.post(`/comments/:id`, [csrfProtection, checkRoles(UserRole.ADMIN)], myController.deleteComment);

module.exports = myRouter;
