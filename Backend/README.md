# Лабораторна робота №2

## Варіант 11
Сервіс чергувань у лабораторії

## Реалізовані сутності
- Users
- Shifts

## Технології
- Node.js
- Express
- TypeScript
- Zod

## Запуск проєкту

```bash
npm install
npm run dev
````

## API

### Health check

GET /api/health

---

## Users

### Отримати всіх користувачів

GET /api/users

### Отримати користувача за id

GET /api/users/:id

### Створити користувача

POST /api/users

```json
{
  "name": "Nadia",
  "email": "nadia@gmail.com"
}
```

### Оновити користувача

PUT /api/users/:id

### Видалити користувача

DELETE /api/users/:id

---

## Shifts

### Отримати всі зміни

GET /api/shifts

### Отримати зміну за id

GET /api/shifts/:id

### Створити зміну

POST /api/shifts

```json
{
  "date": "2026-03-20",
  "timeSlot": "morning",
  "userName": "Nadia",
  "status": "planned"
}
```

### Оновити зміну

PUT /api/shifts/:id

### Видалити зміну

DELETE /api/shifts/:id



