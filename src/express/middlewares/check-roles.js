'use strict';

module.exports = (...roles) => (req, res, next) => {
  const {user} = req.session;

  if (user && roles.includes(user.roleId)) {
    return next();
  }

  return res.redirect(`/`);
};
