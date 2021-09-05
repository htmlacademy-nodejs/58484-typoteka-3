'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (user && user.roleId === 3) {
    return next();
  }
  return res.redirect(`/`);
};
