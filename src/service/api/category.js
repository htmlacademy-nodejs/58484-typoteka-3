'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const bodyValidator = require(`../middlewares/body-validator`);
const categorySchema = require(`../joi-schemas/category-schema`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);

    return res
      .status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, [
    bodyValidator(categorySchema)
  ], async (req, res) => {
    const category = await service.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(category);
  });

  route.put(`/edit/:id`, [
    bodyValidator(categorySchema)
  ], async (req, res) => {
    const category = await service.update(req.params.id, req.body);

    return res
      .status(HttpCode.OK)
      .json(category);
  });
};
