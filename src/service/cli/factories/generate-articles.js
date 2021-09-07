'use strict';

const {generateComment} = require(`./generate-comments`);
const {generateCategories} = require(`./generate-categories`);
const {generateDate} = require(`./date-factory`);
const {
  getRandomItem,
  getRandomInt,
  shuffle,
  getRandomItems,
} = require(`../../../utils`);

const MAX_CATEGORY_LIMIT = 4;

const generateArticles = async (count, users, mockData) => {
  const {
    sentences,
    titles,
    categories,
    comments,
  } = mockData;

  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publishedAt: generateDate(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(2, sentences.length - 1)).join(` `),
    categories: getRandomItems(generateCategories(categories), 1, MAX_CATEGORY_LIMIT).map(({id}) => id),
    comments: Array(getRandomInt(1, 5)).fill({}).map(() => generateComment(comments, index + 1, users)),
    userId: getRandomItem(users).id,
    image: `forest@1x.jpg`,
  }));
};

module.exports = {
  generateArticles
};
