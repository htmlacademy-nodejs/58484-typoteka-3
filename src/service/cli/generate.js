'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);
const moment = require(`moment`);
const {ExitCode} = require(`../../constants`);
const {ChalkTheme} = require(`./chalk-theme`);

const {
  success,
  error,
  warning
} = ChalkTheme.generate;

const {
  getRandomInt,
  shuffle,
  makeUniqueArray,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const FILE_NAME = `mocks.json`;

const DateLimit = {
  DAYS: 90,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
};

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCE = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const getCategories = (min, max) => {
  const categories = Array(getRandomInt(min, max))
    .fill(``)
    .map(() => CATEGORIES[getRandomInt(min, max)]);

  return makeUniqueArray(categories);
};

const generateDate = () => {
  const days = getRandomInt(1, DateLimit.DAYS);
  const hours = getRandomInt(1, DateLimit.HOURS);
  const minutes = getRandomInt(1, DateLimit.MINUTES);
  const seconds = getRandomInt(1, DateLimit.SECONDS);

  const date = moment();

  date.subtract(days, `day`);
  date.subtract(hours, `hour`);
  date.subtract(minutes, `minute`);
  date.subtract(seconds, `second`);

  return date.format(`YYYY-MM-DD HH:mm:ss`);
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: generateDate(),
    announce: shuffle(ANNOUNCE).slice(1, 5).join(` `),
    fullText: shuffle(ANNOUNCE).slice(1, getRandomInt(2, ANNOUNCE.length - 1)).join(` `),
    category: getCategories(1, CATEGORIES.length - 1),
  }))
);

const createFile = async (content) => {
  try {
    const writeFile = promisify(fs.writeFile);

    await writeFile(FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
}

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    await createFile(content);
  }
};
