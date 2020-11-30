'use strict';

const index = (req, res) => {
  res.render(`my`);
};

const showComments = (req, res) => {
  res.render(`comments`);
};

module.exports = {
  index,
  showComments,
};
