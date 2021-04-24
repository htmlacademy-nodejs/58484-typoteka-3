'use strict';
const api = require(`../api`).getAPI();

const showCategories = async (req, res) => {
  const categories = await api.getCategories();

  res.render(`all-categories`, {categories});
};

module.exports = {
  showCategories,
};
