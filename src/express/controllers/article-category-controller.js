'use strict';

const show = (req, res) => {
  const categoryId = req.params.id;
  res.render(`articles-by-category`, {categoryId});
};

module.exports = {
  show,
};
