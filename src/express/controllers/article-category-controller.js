'use strict';

const api = require(`../api`).getAPI();

const show = async (req, res) => {
  const categoryId = req.params.id;
  const articles = await api.getArticles({categoryId, comments: true});
  // TODO: пагинация, активная категория
  return res.render(`articles-by-category`, {articles});
};

module.exports = {
  show,
};
