'use strict';

const api = require(`../api`).getAPI();
const {getSessionError} = require(`../utils`);

const ARTICLES_PER_PAGE = 8;

const showMain = async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true)
  ]);

  const error = getSessionError(req);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, page, totalPages, error});
};

const showSearch = async (req, res) => {
  const {search} = req.query;

  try {
    const results = await api.search(search);

    res.render(`search`, {
      results,
      search
    });
  } catch (error) {
    res.render(`search`, {
      results: [],
      search
    });
  }
};

const showLogin = (req, res) => {
  res.render(`login`);
};

const showRegister = (req, res) => {
  res.render(`sign-up`);
};

module.exports = {
  showMain,
  showSearch,
  showLogin,
  showRegister,
};
