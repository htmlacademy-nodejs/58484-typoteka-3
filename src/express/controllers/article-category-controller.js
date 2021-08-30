'use strict';

const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

const show = async (req, res) => {
  const page = +req.query.page || 1;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const categoryId = req.params.id;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticlesByCategoryId({offset, limit, categoryId}),
    await api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const currentCategory = categories.find((category) => category.id === +categoryId);

  return res.render(`articles-by-category`, {
    articles,
    categories,
    currentCategory,
    totalPages,
    page
  });
};

module.exports = {
  show,
};
