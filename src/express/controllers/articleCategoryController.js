'use strict';

const show = (req, res) => {
  const categoryId = req.params.id;
  res.send(`/articles/category/${categoryId}`);
}

module.exports = {
  show,
}
