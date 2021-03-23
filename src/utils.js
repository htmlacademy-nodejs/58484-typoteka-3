'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  array.forEach((item, index) => {
    const randomPosition = Math.floor(Math.random() * index);
    [array[index], array[randomPosition]] = [array[randomPosition], array[index]];
  });

  return array;
};

const makeUniqueArray = (array) => {
  const set = new Set(array);
  return Array.from(set);
};

const getRandomItems = (array, min = 1, max = array.length - 1) => {
  const items = Array(getRandomInt(min, max))
    .fill(``)
    .map(() => array[getRandomInt(min, max)]);

  return makeUniqueArray(items);
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInt(0, array.length - 1);
  return array[randomIndex];
};

module.exports = {
  getRandomInt,
  shuffle,
  makeUniqueArray,
  getRandomItems,
  getRandomItem,
};
