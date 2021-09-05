'use strict';

const api = require(`../api`).getAPI();

const showMy = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {
    articles,
    user: req.session.user,
  });
};

const showComments = async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {
    articles: articles.slice(0, 3),
    user: req.session.user,
  });
};

module.exports = {
  showMy,
  showComments,
};
