'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {commentId} = req.params;
  const comment = service.findOne(commentId);

  if (!comment) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  return next();
};
