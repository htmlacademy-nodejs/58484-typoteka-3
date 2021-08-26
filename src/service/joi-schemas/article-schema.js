'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  id: Joi.string(),

  title: Joi.string().required(),

  publishedAt: Joi.date().required(),

  announce: Joi.string().required(),

  fullText: Joi.string().required(),

  categories: Joi.array().min(1).required(),

  image: Joi.string(),
});
