'use strict';

const {getRandomItem, shuffle, getRandomInt} = require(`../../../utils`);

const generateComment = (comments, articleId, users) => {
  const maxRowsCount = getRandomInt(1, comments.length);

  const text = shuffle(comments)
    .slice(0, maxRowsCount)
    .join(` `);

  return {
    text,
    userId: getRandomItem(users).id,
    articleId,
  };
};

module.exports = {
  generateComment
};
