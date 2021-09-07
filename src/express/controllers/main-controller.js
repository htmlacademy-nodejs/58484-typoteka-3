'use strict';

const api = require(`../api`).getAPI();
const {getSessionError} = require(`../utils`);

const ARTICLES_PER_PAGE = 8;
const HOT_ARTICLES_LIMIT = 4;
const LAST_COMMENTS_LIMIT = 4;

const showMain = async (req, res) => {
  const page = +req.query.page || 1;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories,
    hotArticles,
    lastComments,
  ] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true),
    api.getHotArticles(HOT_ARTICLES_LIMIT),
    api.getLastComments(LAST_COMMENTS_LIMIT)
  ]);

  const error = getSessionError(req);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {
    articles,
    categories,
    page,
    totalPages,
    error,
    hotArticles,
    lastComments,
    user: req.session.user,
  });
};

const showSearch = async (req, res) => {
  const {search} = req.query;

  try {
    const results = await api.search(search);

    res.render(`search`, {
      results,
      search,
      user: req.session.user,
    });
  } catch (error) {
    res.render(`search`, {
      results: [],
      search,
      user: req.session.user,
    });
  }
};

const showLogin = (req, res) => {
  const error = getSessionError(req);

  res.render(`auth`, {
    currentUrl: req.url,
    error,
    csrfToken: req.csrfToken(),
  });
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    req.session.user = await api.auth(email, password);
    res.redirect(`/`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }
};

const logout = async (req, res) => {
  delete req.session.user;
  res.redirect(`/login`);
};

const showRegister = (req, res) => {
  const error = getSessionError(req);

  res.render(`auth`, {
    error,
    currentUrl: req.url,
    csrfToken: req.csrfToken(),
  });
};

const registerUser = async (req, res) => {
  const {body, file} = req;

  const userData = {
    firstName: body[`first-name`],
    lastName: body[`last-name`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`password-repeated`],
    ...(file ? {avatar: file.filename} : {})
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }
};

module.exports = {
  showMain,
  showSearch,
  showLogin,
  showRegister,
  registerUser,
  loginUser,
  logout,
};
