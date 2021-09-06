'use strict';

const api = require(`../api`).getAPI();
const {getSessionError} = require(`../utils`);

const showCategories = async (req, res) => {
  const categories = await api.getCategories();
  const error = getSessionError(req);

  res.render(`all-categories`, {
    categories,
    user: req.session.user,
    csrfToken: req.csrfToken(),
    error
  });
};

const storeCategory = async (req, res) => {
  const {category} = req.body;

  try {
    await api.createCategory(category);
    res.redirect(`back`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }

};

module.exports = {
  showCategories,
  storeCategory,
};
