
# Backend для лабораторної роботи №4

Ця папка містить серверну частину проєкту для інтеграції фронтенду з бекендом через HTTP API.

## Основне призначення

Бекенд надає REST API для роботи з сутностями сервісу чергувань у лабораторії:

- Users;
- Schedule;
- Shifts;
- SwapRequests.

У лабораторній роботі №4 основна інтеграція фронтенду виконується із сутністю `Shifts`.

## Версія API

Усі маршрути API використовують префікс:

```text
/api/v1
````

Основні маршрути для `Shifts`:

```text
GET    /api/v1/shifts
GET    /api/v1/shifts/:id
POST   /api/v1/shifts
PUT    /api/v1/shifts/:id
DELETE /api/v1/shifts/:id
```

## Запуск бекенду

У терміналі потрібно перейти в папку `Backend`:

```bash
cd Backend
```

Встановити залежності:

```bash
npm install
```

Виконати міграції бази даних:

```bash
npm run migrate
```

Заповнити базу тестовими даними:

```bash
npm run seed
```

Запустити сервер у режимі розробки:

```bash
npm run dev
```

Після запуску API доступний за адресою:

```text
http://localhost:3000
```

Приклад перевірки:

```text
http://localhost:3000/api/v1/shifts
```

## CORS

Для роботи фронтенду в браузері налаштовано CORS із конкретними дозволеними origin, зокрема:

```text
http://localhost:5500
http://127.0.0.1:5500
http://localhost:5173
http://127.0.0.1:5173
```

Це дозволяє фронтенду запускатися окремо від бекенду та виконувати запити через `fetch()`.

## Помилки

Бекенд повертає помилки в узгодженому форматі:

```ts
interface ApiError {
  status: number;
  code: string;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
```

Цей формат обробляється фронтендом через окремий модуль `apiClient`.

````

