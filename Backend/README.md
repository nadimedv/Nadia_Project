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
## Додаткові можливості

### Фільтрація
GET /api/shifts?status=planned

### Сортування
GET /api/shifts?sortBy=date&order=desc

### Пагінація
GET /api/shifts?page=1&pageSize=2



## Приклади запитів (curl)

### Health check
```bash
curl -i http://localhost:3000/api/health
````

### Отримати всіх users

```bash
curl -i http://localhost:3000/api/users
```

### Створити user

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Nadia\",\"email\":\"nadia@gmail.com\"}"
```

### Отримати всі shifts

```bash
curl -i http://localhost:3000/api/shifts
```

### Створити shift

```bash
curl -i -X POST http://localhost:3000/api/shifts \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2026-03-20\",\"timeSlot\":\"morning\",\"userName\":\"Nadia\",\"status\":\"planned\"}"
```

### Фільтрація shifts

```bash
curl -i "http://localhost:3000/api/shifts?status=planned"
```

### Сортування shifts

```bash
curl -i "http://localhost:3000/api/shifts?sortBy=date&order=desc"
```

### Пагінація shifts

```bash
curl -i "http://localhost:3000/api/shifts?page=1&pageSize=2"
```





