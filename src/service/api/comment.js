'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/last`, async (req, res) => {
    const {limit} = req.query;
    const comments = await service.getLastComments(limit);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });
};
