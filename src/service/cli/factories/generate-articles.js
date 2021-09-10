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
const MIN_RANDOM_COUNT = 1;
const MAX_RANDOM_COUNT = 5;

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
    announce: shuffle(sentences).slice(MIN_RANDOM_COUNT, MAX_RANDOM_COUNT).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(2, sentences.length - 1)).join(` `),
    categories: getRandomItems(generateCategories(categories), MIN_RANDOM_COUNT, MAX_CATEGORY_LIMIT).map(({id}) => id),
    comments: Array(getRandomInt(MIN_RANDOM_COUNT, MAX_RANDOM_COUNT)).fill({}).map(() => generateComment(comments, index + 1, users)),
    userId: getRandomItem(users).id,
    image: `forest@1x.jpg`,
  }));
};

module.exports = {
  generateArticles
};
