'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const bodyValidator = require(`../middlewares/body-validator`);
const userAlreadyRegister = require(`../middlewares/user-already-register`);
const passwordUtils = require(`../lib/password`);
const userScheme = require(`../joi-schemas/user-schema`);

module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, [
    bodyValidator(userScheme),
    userAlreadyRegister(userService)
  ], async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await userService.create(data);

    delete result.passwordHash;

    return res.status(HttpCode.CREATED)
      .json(result);
  });
};
