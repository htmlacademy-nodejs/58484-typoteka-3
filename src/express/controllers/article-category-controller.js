'use strict';

const show = (req, res) => {
  const categoryId = req.params.id;
  return res.render(`articles-by-category`, {categoryId});
};

module.exports = {
  show,
};
