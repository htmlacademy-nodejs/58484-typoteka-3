'use strict';

const index = (req, res) => {
  res.send(`/`);
};

const showSearch = (req, res) => {
  res.send(`/search`);
};

const showLogin = (req, res) => {
  res.send(`/login`);
}

const showRegister = (req, res) => {
  res.send(`/register`);
}

module.exports = {
  index,
  showSearch,
  showLogin,
  showRegister,
}

