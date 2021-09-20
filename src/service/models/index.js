'use strict';

const Alias = require(`./alias`);

const defineRole = require(`./role`);
const defineUser = require(`./user`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);

module.exports = {
  Alias,
  defineRole,
  defineUser,
  defineArticle,
  defineCategory,
  defineComment,
  defineArticleCategory,
};
