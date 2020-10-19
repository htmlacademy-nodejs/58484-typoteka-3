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
  })

  return array;
};

const makeUniqueArray = (array) => {
  const set = new Set(array);
  return Array.from(set);
};

module.exports = {
  getRandomInt,
  shuffle,
  makeUniqueArray,
};
