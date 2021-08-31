'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).required(),

  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).required(),

  email: Joi.string().email().required(),

  avatar: Joi.string(),

  password: Joi.string().min(6).required(),

  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`))
});
