'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  id: Joi.string(),

  title: Joi.string().required().min(30).max(250),

  publishedAt: Joi.date().required(),

  announce: Joi.string().required().min(30).max(250),

  fullText: Joi.string().allow(``).optional().max(1000),

  categories: Joi.array().min(1).required(),

  image: Joi.string(),
});
