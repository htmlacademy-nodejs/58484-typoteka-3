'use strict';

const index = (req, res) => {
  res.render(`main`);
};

const showSearch = (req, res) => {
  res.render(`search`);
};

const showLogin = (req, res) => {
  res.render(`login`);
};

const showRegister = (req, res) => {
  res.render(`sign-up`);
};

module.exports = {
  index,
  showSearch,
  showLogin,
  showRegister,
};
