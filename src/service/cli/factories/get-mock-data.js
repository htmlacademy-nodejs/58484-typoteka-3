'use strict';
const {MockFileName} = require(`../../../constants`);
const {getFileContent} = require(`../services/get-file-content`);

const getMockData = async () => {
  const files = Object
    .values(MockFileName)
    .map((fileName) => getFileContent(`./data/${fileName}`));

  const [
    sentences,
    titles,
    categories,
    comments,
  ] = await Promise.all(files);

  return {
    sentences,
    titles,
    categories,
    comments,
  };
};

module.exports = {
  getMockData
};
