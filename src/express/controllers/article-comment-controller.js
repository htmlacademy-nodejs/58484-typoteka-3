'use strict';

const api = require(`../api`).getAPI();

const store = async (req, res) => {
  const articleId = req.params.id;
  const {text} = req.body;

  try {
    await api.createComment(articleId, {text});
  } catch (err) {
    req.session.error = err.response.data;
  } finally {
    res.redirect(`back`);
  }
};

module.exports = {
  store,
};
