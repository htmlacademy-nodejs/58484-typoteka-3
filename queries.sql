-- Получить список всех категорий (идентификатор, наименование категории);
SELECT
   categories.id,
   categories.title
FROM categories;

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT
   categories.id,
   categories.title
FROM categories
JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY categories.id;

-- Получить список категорий с количеством публикаций (идентификатор, наименование
-- категории, количество публикаций в категории);
SELECT
   categories.id,
   categories.title,
   COUNT(articles_categories.article_id) AS article_count
FROM categories
LEFT JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY categories.id;

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT
   articles.id,
   articles.title,
   articles.announce,
   articles.published_at,
   users.first_name,
   users.last_name,
   users.email,
   COUNT(comments.id) AS comment_count,
   STRING_AGG(DISTINCT categories.title, ', ') AS category_list
FROM articles
JOIN users ON users.id = articles.user_id
LEFT JOIN comments ON articles.id = comments.article_id
JOIN articles_categories ON articles.id = articles_categories.article_id
JOIN categories ON articles_categories.category_id = categories.id
GROUP BY articles.id, users.id, articles.published_at
ORDER BY articles.published_at DESC;

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс,
-- полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий);
SELECT
   articles.id,
   articles.title,
   articles.announce,
   articles.full_text,
   articles.image,
   articles.published_at,
   users.first_name,
   users.last_name,
   users.email,
   COUNT(comments.id) AS comment_count,
   STRING_AGG(DISTINCT categories.title, ', ') AS category_list
FROM articles
JOIN users ON users.id = articles.user_id
LEFT JOIN comments ON articles.id = comments.article_id
JOIN articles_categories ON articles.id = articles_categories.article_id
JOIN categories ON articles_categories.category_id = categories.id
WHERE articles.id = 1
GROUP BY articles.id, users.id;

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария);
SELECT
   comments.id,
   articles.id,
   users.first_name,
   users.last_name,
   comments.text
FROM comments
LEFT JOIN articles ON articles.id = comments.article_id
LEFT JOIN users ON users.id = comments.user_id
GROUP BY articles.id, comments.id, users.id, comments.created_at
ORDER BY comments.created_at
LIMIT 5;

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
   comments.id,
   articles.id,
   users.first_name,
   users.last_name,
   comments.text
FROM comments
LEFT JOIN articles ON articles.id = comments.article_id
LEFT JOIN users ON users.id = comments.user_id
WHERE articles.id = 1
GROUP BY articles.id, comments.id, users.id, comments.created_at
ORDER BY comments.created_at;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE
  articles
SET
  title = 'Как я встретил Новый год'
WHERE id = 1;
