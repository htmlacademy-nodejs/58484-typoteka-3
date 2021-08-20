'use strict';

const api = require(`../api`).getAPI();

const show = async (req, res) => {
  const categoryId = req.params.id;
  const articles = await api.getArticles({categoryId, comments: true});
  const categories = await api.getCategories(true);
  // TODO: пагинация, выборка постов по категории
  return res.render(`articles-by-category`, {
    articles,
    categories,
    currentCategoryId: categoryId
  });
};

module.exports = {
  show,
};
