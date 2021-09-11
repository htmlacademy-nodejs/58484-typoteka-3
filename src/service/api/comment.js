'use strict';

const {Router} = require(`express`);
const {eventEmitter} = require(`../event-emitter`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const comments = await service.findAll();

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.get(`/last`, async (req, res) => {
    const {limit} = req.query;
    const comments = await service.getLastComments(limit);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:id`, async (req, res) => {
    const {id} = req.params;

    const comment = await service.drop(id);
    eventEmitter.emit(`comments:updated`);

    return res
      .status(HttpCode.OK)
      .json(comment);
  });
};
