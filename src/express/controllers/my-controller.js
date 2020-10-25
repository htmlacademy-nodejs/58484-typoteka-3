'use strict';

const index = (req, res) => {
  res.send(`/my`);
}

const showComments = (req, res) => {
  res.send(`/my/comments`);
}

module.exports = {
  index,
  showComments,
};
