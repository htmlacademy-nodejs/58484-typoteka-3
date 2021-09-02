'use strict';

const {HttpCode, RegisterMessage} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;

  const userByEmail = await service.findByEmail(newUser.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send({
        message: [RegisterMessage.USER_ALREADY_REGISTER],
        data: newUser.email
      });
  }

  return next();
};
