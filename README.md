# Nadia Project — Лабораторна робота №5

## Тема

Уразливості і захист вебзастосунків.

## Варіант

Варіант 11 — сервіс чергувань у лабораторії.

## Мета роботи

Метою лабораторної роботи є виявлення та відтворення типових уразливостей вебзастосунків у контрольованому навчальному середовищі, а також їх виправлення на рівні коду та конфігурації.

У роботі реалізовано перевірку таких сценаріїв:

1. SQL Injection.
2. XSS.
3. Broken Access Control / IDOR.
4. Security Misconfiguration.

Проєкт виконано на базі попередніх лабораторних робіт з використанням frontend-частини, backend-частини на TypeScript та бази даних SQLite.

---

## Структура проєкту

```text
Nadia_Project
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── dtos
│   │   ├── errors
│   │   ├── middleware
│   │   ├── migrations
│   │   ├── repositories
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   ├── types
│   │   ├── app.ts
│   │   ├── config.ts
│   │   └── server.ts
│   ├── lab5-security-regression.http
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── apiClient.ts
│   │   ├── config.ts
│   │   ├── dtos.ts
│   │   └── main.ts
│   ├── Main.html
│   ├── styles.css
│   ├── app.js
│   └── package.json
│
├── docs
├── REPORT_LAB5.md
└── README.md
````

Backend розділено на окремі файли та папки: routes, controllers, services, repositories, middleware, schemas. Це зроблено для зручності підтримки коду та зменшення ризику конфліктів, якщо декілька людей змінюють різні частини проєкту.

---

## Реалізовані сценарії безпеки

### 1. SQL Injection

Уразливість SQL Injection була розглянута на прикладі пошуку, фільтрації та сортування чергувань.

Виправлення:

* SQL-запити виконуються через параметризовані запити;
* користувацькі значення не вставляються напряму в SQL-рядок;
* для сортування використано allowlist допустимих полів.

Основні файли:

```text
Backend/src/repositories/shift.repository.ts
Backend/lab5-security-regression.http
```

---

### 2. XSS

XSS-сценарій пов’язаний із відображенням даних користувача на сторінці.

Виправлення:

* небезпечне використання innerHTML для користувацьких даних замінено на безпечний рендеринг;
* використовуються createElement, textContent, replaceChildren;
* введений HTML/JS-вміст відображається як звичайний текст і не виконується браузером.

Основні файли:

```text
Frontend/src/main.ts
Frontend/app.js
```

---

### 3. Broken Access Control / IDOR

Для демонстрації IDOR використовується сутність чергування, яка має власника.

Виправлення:

* додано поле ownerUserId;
* поточний користувач визначається через заголовок X-Demo-UserId;
* доступ до чужих записів блокується на бекенді;
* перевірка власника виконується для читання, редагування та видалення.

Основні файли:

```text
Backend/src/middleware/demo-auth.middleware.ts
Backend/src/repositories/shift.repository.ts
Backend/src/services/shift.service.ts
Backend/src/routes/shift.routes.ts
```

---

### 4. Security Misconfiguration

У межах мінімального hardening було налаштовано базові механізми захисту.

Реалізовано:

* централізовану обробку помилок;
* єдиний формат помилок;
* приховування dev-деталей у production;
* базові security headers;
* обмежений CORS.

Основні файли:

```text
Backend/src/middleware/security-headers.middleware.ts
Backend/src/middleware/error-handler.middleware.ts
Backend/src/app.ts
```

---

## Запуск backend

Перейти в папку Backend:

```bash
cd Backend
```

Встановити залежності:

```bash
npm install
```

Запустити міграції:

```bash
npm run migrate
```

Заповнити базу тестовими даними:

```bash
npm run seed
```

Запустити backend:

```bash
npm run dev
```

Backend працює за адресою:

```text
http://localhost:3000
```

---

## Запуск frontend

У другому терміналі перейти в папку Frontend:

```bash
cd Frontend
```

Встановити залежності:

```bash
npm install
```

Запустити frontend:

```bash
npm run dev
```

Frontend працює за адресою:

```text
http://localhost:5500
```

---

## Перевірка сценаріїв безпеки

Для перевірки сценаріїв лабораторної роботи використовується файл:

```text
Backend/lab5-security-regression.http
```

У ньому підготовлені HTTP-запити для перевірки:

* SQL Injection;
* IDOR;
* XSS;
* security headers;
* коректної обробки помилок.

Файл можна запускати через вбудований HTTP Client у WebStorm.

---

## Приклади очікуваної поведінки

### Відсутній користувач

Якщо запит до захищеного endpoint виконується без заголовка:

```text
X-Demo-UserId
```

сервер повертає:

```text
401 Unauthorized
```

### Доступ до чужого ресурсу

Якщо користувач намагається отримати чуже чергування, сервер повертає:

```text
404 Not Found
```

Такий підхід не розкриває, чи існує ресурс насправді.

### SQL Injection

Підозрілий ввід не змінює структуру SQL-запиту, тому не повертає зайві дані та не ламає роботу сервера.

### XSS

Введений HTML/JS-вміст відображається як текст і не виконується браузером.

---

## Основні команди

Backend:

```bash
cd Backend
npm install
npm run migrate
npm run seed
npm run dev
```

Frontend:

```bash
cd Frontend
npm install
npm run dev
```

Build backend:

```bash
cd Backend
npm run build
```

Build frontend:

```bash
cd Frontend
npm run build
```

---

## Звіт

Короткий звіт до лабораторної роботи знаходиться у файлі:

```text
REPORT_LAB5.md
```

У звіті описано кожний сценарій за структурою:

```text
було → відтворення → виправлення → перевірка
```

Також наведено таблицю:

```text
ризик → наслідок → виправлення
```

---

## Репозиторій

Код лабораторної роботи розміщується у репозиторії:

```text
https://github.com/nadimedv/Nadia_Project
```

Фінальна версія лабораторної роботи має бути позначена тегом:

```text
5.0.0
```

