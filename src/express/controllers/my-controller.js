'use strict';

const api = require(`../api`).getAPI();

const index = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
};

const showComments = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles: articles.slice(0, 3)});
};

module.exports = {
  index,
  showComments,
};
