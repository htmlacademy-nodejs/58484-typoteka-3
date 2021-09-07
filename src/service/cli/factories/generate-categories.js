'use strict';

const generateCategories = (categories) => {
  return categories.map((title, index) => ({
    id: index + 1,
    title
  }));
};

module.exports = {
  generateCategories
};
