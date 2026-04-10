# Лабораторна робота №3

## SQLite: реляційна модель, схема даних, CRUD-запити, підключення SQLite у бекенді

Цей проєкт є розширенням бекенду семестрового застосунку.  
У роботі реалізовано збереження даних у SQLite, ініціалізацію схеми бази даних при старті застосунку, CRUD-операції для сутностей варіанта та тестове наповнення бази через seed-скрипт.

## Технології

- Node.js
- Express
- TypeScript
- SQLite (`sqlite3`)

## Запуск проєкту

1. Перейти в папку `Backend`
2. Встановити залежності:

```bash
npm install
```

3. Запустити сервер у режимі розробки:

```bash
npm run dev
```

Після запуску сервер стартує на:

```text
http://localhost:3000
```

## Ініціалізація бази даних

При старті застосунку автоматично виконується ініціалізація схеми БД через `CREATE TABLE IF NOT EXISTS`.

База даних створюється автоматично при першому запуску.

## Де створюється база даних

SQLite-файл створюється локально за шляхом:

```text
Backend/data/app.db
```

Файл бази даних не зберігається в репозиторії та доданий у `.gitignore`.

## Скрипти

Запуск сервера:

```bash
npm run dev
```

Заповнення бази тестовими даними:

```bash
npm run seed
```

## Схема БД

У проєкті реалізовано такі таблиці:

### Users

Поля:
- `id` — первинний ключ
- `name` — ім’я користувача
- `email` — електронна пошта, унікальне поле

### Shifts

Поля:
- `id` — первинний ключ
- `date` — дата зміни
- `timeSlot` — часовий слот
- `userName` — ім’я користувача, який чергує
- `comment` — коментар
- `status` — статус зміни

### Schedule

Поля:
- `id` — первинний ключ
- `date` — дата розкладу
- `shiftId` — зовнішній ключ на `Shifts.id`
- `note` — примітка

### SwapRequests

Поля:
- `id` — первинний ключ
- `shiftId` — зовнішній ключ на `Shifts.id`
- `requestedBy` — користувач, який ініціював обмін
- `targetUser` — користувач, якому пропонується обмін
- `status` — статус заявки на обмін

## Зв’язки між таблицями

- `Schedule.shiftId -> Shifts.id`
- `SwapRequests.shiftId -> Shifts.id`

Для зовнішніх ключів використано `FOREIGN KEY` з поведінкою `ON DELETE CASCADE`.

## Обмеження цілісності

У схемі використано такі обмеження:

- `NOT NULL` для обов’язкових полів
- `UNIQUE` для поля `Users.email`
- `CHECK` для статусів:
    - `Shifts.status IN ('planned', 'done', 'canceled')`
    - `SwapRequests.status IN ('pending', 'approved', 'rejected')`

## CRUD-операції

### Users
- `POST /api/users` — створити користувача
- `GET /api/users` — отримати список користувачів
- `GET /api/users/:id` — отримати користувача за id
- `PUT /api/users/:id` — оновити користувача
- `DELETE /api/users/:id` — видалити користувача

### Shifts
- `POST /api/shifts` — створити зміну
- `GET /api/shifts` — отримати список змін
- `GET /api/shifts/:id` — отримати зміну за id
- `PUT /api/shifts/:id` — оновити зміну
- `DELETE /api/shifts/:id` — видалити зміну

### Schedule
- `POST /api/schedule` — створити запис розкладу
- `GET /api/schedule` — отримати список записів
- `GET /api/schedule/:id` — отримати запис за id
- `PUT /api/schedule/:id` — оновити запис
- `DELETE /api/schedule/:id` — видалити запис

## HTTP-коди відповідей

У проєкті використовуються такі коди:

- `201 Created` — успішне створення запису
- `400 Bad Request` — некоректне тіло запиту або невалідні дані
- `404 Not Found` — ресурс не знайдено
- `409 Conflict` — порушення унікальності, наприклад дублювання email

## Приклади запитів

### Отримати всіх користувачів

```text
GET /api/users
```

### Створити користувача

```text
POST /api/users
Content-Type: application/json

{
  "name": "Nadia",
  "email": "nadia@example.com"
}
```

### Створити зміну

```text
POST /api/shifts
Content-Type: application/json

{
  "date": "2026-04-20",
  "timeSlot": "12:00-14:00",
  "userName": "Nadia",
  "comment": "Done shift for filter test",
  "status": "done"
}
```

### Оновити зміну

```text
PUT /api/shifts/1
Content-Type: application/json

{
  "date": "2026-04-21",
  "timeSlot": "10:00-12:00",
  "userName": "Nadia",
  "comment": "Updated shift",
  "status": "done"
}
```

### Видалити зміну

```text
DELETE /api/shifts/1
```

### Приклад запиту з WHERE + ORDER BY + LIMIT

```text
GET /api/shifts?status=done&sortBy=date&order=desc&page=1&pageSize=1
```

Цей запит:
- фільтрує записи за статусом `done`
- сортує за датою у спадному порядку
- повертає лише одну позицію з першої сторінки

## Seed

Для швидкого наповнення бази тестовими записами використовується окремий seed-скрипт:

```bash
npm run seed
```

Seed:
- очищає таблиці
- додає тестових користувачів
- додає тестові зміни
- додає записи розкладу
- додає тестову заявку на обмін

## Логування

У консолі логуються ключові події роботи з базою:
- відкриття SQLite-бази
- ініціалізація схеми
- запуск seed
- завершення seed

## Примітка

У цій лабораторній роботі SQL-запити реалізовані без ORM і без параметризованих запитів, відповідно до умов методичних вказівок.



exit
## Міграції

У проєкті реалізовано спрощений механізм міграцій без ORM.

Міграції зберігаються в папці:

```text
src/migrations
````

Використані SQL-файли:

* `001_create_users.sql`
* `002_create_shifts.sql`
* `003_create_schedule.sql`
* `004_create_swap_requests.sql`
* `005_add_indexes.sql`

Для запуску міграцій використовується команда:

```bash
npm run migrate
```

Інформація про вже застосовані міграції зберігається в таблиці:

```text
schema_migrations
```

При повторному запуску застосовуються тільки ті міграції, яких ще немає в `schema_migrations`.

## Індекс

Для прискорення типового запиту фільтрації та сортування додано індекс:

```text
idx_shifts_status_date
```

Індекс створюється в міграції:

```text
005_add_indexes.sql
```

Він використовується для запитів до `Shifts`, де є фільтрація за `status` і сортування за `date`.

## Додаткові endpoint-и

### JOIN endpoint

Отримання записів розкладу разом із пов’язаними даними змін:

```text
GET /api/schedule/with-shifts
```

Приклад із фільтрацією та сортуванням:

```text
GET /api/schedule/with-shifts?status=planned&sortBy=shiftDate&order=desc
```

Цей endpoint використовує `JOIN` між таблицями `Schedule` і `Shifts`.

### Aggregation endpoint

Отримання статистики по кількості змін за статусами:

```text
GET /api/shifts/stats/status-counts
```

Цей endpoint використовує SQL-агрегацію:

```text
COUNT(*)
```

### Узгоджена операція для кількох сутностей

Підтвердження заявки на обмін зміною:

```text
POST /api/swap-requests/:id/approve
```

Під час виконання:

* статус заявки в `SwapRequests` змінюється на `approved`
* у відповідному записі `Shifts` оновлюється `userName`

Операція виконується послідовно та узгоджено через транзакцію.

