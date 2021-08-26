'use strict';

const getSessionError = (req) => {
  const {error = null} = req.session;
  delete req.session.error;

  return error;
};

module.exports = {
  getSessionError,
};
