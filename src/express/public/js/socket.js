'use strict';
const SOCKET_PORT = 4000;
const TRUNCATE_LIMIT = 100;

const socket = io(`http://localhost:${SOCKET_PORT}`);

const truncate = (input, limit = TRUNCATE_LIMIT) => {
  return (input.length > limit)
    ? `${input.substring(0, limit)}...`
    : input;
};

const createHotArticle = ({id, announce, comments_count}) => {
  return `
    <li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${id}">
        ${truncate(announce)}
        <sup class="hot__link-sup">${comments_count}</sup>
      </a>
    </li>
  `;
}

const createLastComment = ({articleId, text, user}) => {
  return `
    <li class="last__list-item">
      <img class="last__list-image" src="img/${user.avatar}" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${user.fullName}</b>
      <a class="last__list-link" href="/articles/${articleId}#post-comments">${truncate(text)}</a>
    </li>
  `;
}

socket.on(`comments:updated`, (data) => {
  const hotListElement = document.querySelector(`.hot__list`);
  const lastListElement = document.querySelector(`.last__list`);

  const {lastComments, hotArticles} = JSON.parse(data);

  hotListElement.innerHTML = hotArticles.map(createHotArticle).join(``);
  lastListElement.innerHTML = lastComments.map(createLastComment).join(``);
});
