# Лабораторна робота №5. Уразливості і захист

Проєкт: **Nadia_Project**, варіант 11 — «Сервіс чергувань у лабораторії». Ключова сутність варіанту — `Shifts`; для сценарію IDOR вона використана як ресурс, що належить конкретному користувачу через поле `ownerUserId`.

## Що реалізовано за рівнями

| Рівень | Виконання |
|---|---|
| Задовільно | SQL Injection + IDOR, `X-Demo-UserId`, `401` без користувача, `404` для чужого ресурсу, параметризовані SQL-запити. |
| Добре | Додано XSS-захист у UI, централізовані помилки, базові security headers, обмежений CORS. |
| Відмінно | Реалізовано всі 4 сценарії: SQLi, XSS, IDOR, Security Misconfiguration; бекенд TypeScript; доступ перевіряється для read/update/delete; є файл `lab5-security-regression.http`. |

## 1. SQL Injection

### Було
У попередній версії частина SQL-запитів у `shift.repository.ts` будувалася через шаблонні рядки та ручне екранування, наприклад для фільтрів `status`, `userName`, `findDuplicate`, `create`, `update`. Це небезпечно, бо дані користувача можуть впливати на структуру SQL-запиту.

### Відтворення
Приклад небезпечного вводу для перевірки:

```http
GET http://localhost:3000/api/v1/shifts?userName=Nadia'%20OR%201=1%20--&sortBy=date&order=desc
X-Demo-UserId: 1
```

У вразливій версії такий підхід міг змінити логіку `WHERE` або ламати SQL-синтаксис.

### Виправлення
У `Backend/src/db/db.ts` функції `run`, `get`, `all` тепер приймають параметри. У `Backend/src/repositories/shift.repository.ts` запити переписані на параметризовані:

```ts
WHERE userName = ?
```

а значення передається окремо у масиві параметрів. Для `ORDER BY` використано allowlist: дозволені тільки `date`, `timeSlot`, `userName`, `status`.

### Перевірка
Після виправлення payload сприймається як звичайний текст. Нормальний запит із `userName=Nadia` працює, а ін’єкційний рядок не повертає чужі записи і не змінює SQL-логіку.

## 2. Broken Access Control / IDOR

### Було
Раніше доступ до зміни можна було отримати тільки за `id`, наприклад:

```http
GET /api/v1/shifts/1
```

Якби користувач знав чужий `id`, він міг би спробувати прочитати, змінити або видалити чужий запис.

### Відтворення
Приклад: запис `id=1` належить Nadia (`ownerUserId=1`). Користувач Olena (`X-Demo-UserId: 2`) пробує прочитати цей запис:

```http
GET http://localhost:3000/api/v1/shifts/1
X-Demo-UserId: 2
```

### Виправлення
Додано middleware `demoAuth`, який читає `X-Demo-UserId`, перевіряє формат і наявність користувача в таблиці `Users`. У таблицю `Shifts` додано `ownerUserId`. Для читання, оновлення та видалення використано перевірку власника на бекенді:

```sql
WHERE id = ? AND ownerUserId = ?
```

Захищені операції: `GET /shifts/:id`, `PUT /shifts/:id`, `DELETE /shifts/:id`, а також список і статистика віддають тільки власні записи користувача.

### Перевірка
Без `X-Demo-UserId` сервер повертає `401`. Для власного ресурсу сервер повертає `200`. Для чужого ресурсу сервер повертає `404`, щоб не розкривати, чи існує такий запис.

## 3. XSS

### Було
У фронтенді були місця, де таблиця і деталі запису формувалися через `innerHTML`. Це небезпечно, якщо користувач введе HTML/JS-подібний текст у поле коментаря.

### Відтворення
Тестовий коментар:

```text
<img src=x onerror=alert('xss')>
```

У вразливій версії браузер міг інтерпретувати це не як текст, а як HTML.

### Виправлення
У `Frontend/src/main.ts` і `Frontend/app.js` рендер таблиці та деталей переписано через DOM API: `document.createElement`, `textContent`, `replaceChildren`. Дані користувача більше не вставляються в HTML-рядок.

### Перевірка
Після виправлення той самий рядок відображається як звичайний текст у таблиці/деталях і не змінює DOM як HTML-код.

## 4. Security Misconfiguration

### Було
Для лабораторної потрібно було перевірити, щоб сервер не показував зайві dev-деталі, мав узгоджені помилки, security headers і не надто широкий CORS.

### Виправлення
Додано `Backend/src/middleware/security-headers.middleware.ts`:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: no-referrer`;
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`.

У `app.ts` CORS обмежено локальними origin фронтенду, а також додано дозвіл для заголовка `X-Demo-UserId`. У `error-handler.middleware.ts` збережено єдиний формат помилок. У production режимі клієнт не отримує stack trace.

### Перевірка
Перевірити headers можна через DevTools → Network або через HTTP-запит до `/api/v1/health`. Перевірка помилок: невалідний body повертає `400`, відсутній `X-Demo-UserId` повертає `401`, чужий ресурс повертає `404`.

## Коротка таблиця «ризик → наслідок → виправлення»

| Ризик | Наслідок | Виправлення |
|---|---|---|
| SQL Injection | Користувацький ввід може змінити логіку SQL-запиту. | Параметризовані запити `?` + allowlist для сортування. |
| XSS | Коментар або інше поле може виконатися/інтерпретуватися як HTML. | DOM API + `textContent` замість `innerHTML`. |
| IDOR | Користувач може отримати доступ до чужого запису за `id`. | `X-Demo-UserId`, `ownerUserId`, перевірка `id + ownerUserId` на бекенді. |
| Misconfiguration | Сервер може розкрити dev-деталі або працювати з надто широкими дозволами. | Security headers, обмежений CORS, централізований формат помилок. |

## Як запускати

```bash
cd Backend
npm install
npm run migrate
npm run seed
npm run dev
```

В іншому терміналі:

```bash
cd Frontend
npm install
npm run build
npm run serve
```

Для перевірки сценаріїв у WebStorm можна відкрити `Backend/lab5-security-regression.http` і запускати запити зеленими кнопками біля кожного блоку.
