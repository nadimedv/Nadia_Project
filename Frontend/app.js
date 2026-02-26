// STATE
let shifts = [];
let nextId = 1;

// DOM
const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");

// HANDLERS (події)
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const dto = readForm();
    const isValid = validate(dto);
    if (!isValid) return;

    addShift(dto);
    renderTable(shifts);
    resetForm();
    clearErrors();
});

resetBtn.addEventListener("click", () => {
    resetForm();
    clearErrors();
});


tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("delete-btn")) return;

    const id = Number(target.dataset.id);
    deleteShiftById(id);
    renderTable(shifts);
});

// Первинний рендер
renderTable(shifts);

// READ (зчитати форму)

function readForm() {
    return {
        userName: document.getElementById("userInput").value,
        date: document.getElementById("dateInput").value,
        timeFrom: document.getElementById("timeFromInput").value,
        timeTo: document.getElementById("timeToInput").value
    };
}

// VALIDATE (валідація)
function validate(dto) {
    clearErrors();
    let isValid = true;

    const user = dto.userName.trim();
    if (user === "") {
        showError("userInput", "userError", "Поле є обов’язковим.");
        isValid = false;
    } else if (user.length < 3) {
        showError("userInput", "userError", "Мінімум 3 символи.");
        isValid = false;
    } else if (user.length > 30) {
        showError("userInput", "userError", "Максимум 30 символів.");
        isValid = false;
    }

    if (dto.date === "") {
        showError("dateInput", "dateError", "Вкажіть дату.");
        isValid = false;
    }

    if (dto.timeFrom === "") {
        showError("timeFromInput", "timeFromError", "Вкажіть час початку.");
        isValid = false;
    }

    if (dto.timeTo === "") {
        showError("timeToInput", "timeToError", "Вкажіть час завершення.");
        isValid = false;
    }

    if (dto.timeFrom !== "" && dto.timeTo !== "" && dto.timeTo <= dto.timeFrom) {
        showError("timeToInput", "timeToError", "Час завершення має бути пізніше часу початку.");
        isValid = false;
    }

    return isValid;
}

// UPDATE (зміни state)
function addShift(dto) {
    const item = {
        id: nextId++,
        userName: dto.userName.trim(),
        date: dto.date,
        timeFrom: dto.timeFrom,
        timeTo: dto.timeTo
    };

    shifts.push(item);
}

function deleteShiftById(id) {
    shifts = shifts.filter(x => x.id !== id);
}
// RENDER (оновити UI)
function renderTable(items) {
    const rowsHtml = items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.userName}</td>
      <td>${item.date}</td>
      <td>${item.timeFrom} – ${item.timeTo}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${item.id}">
          Видалити
        </button>
      </td>
    </tr>
  `).join("");

    tbody.innerHTML = rowsHtml;
}

// UI HELPERS (помилки/форма)
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = message;
}

function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("invalid");
    document.getElementById(errorId).innerText = "";
}

function clearErrors() {
    clearError("userInput", "userError");
    clearError("dateInput", "dateError");
    clearError("timeFromInput", "timeFromError");
    clearError("timeToInput", "timeToError");
}

function resetForm() {
    form.reset();// STATE
    let shifts = [];
    let nextId = 1;

// DOM
    const form = document.getElementById("createForm");
    const tbody = document.getElementById("itemsTableBody");
    const resetBtn = document.getElementById("resetBtn");
    const userInputEl = document.getElementById("userInput"); // NEW: для фокусу

// HANDLERS (події)
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // щоб не було перезавантаження

        const dto = readForm();
        const isValid = validate(dto);
        if (!isValid) return;

        addShift(dto);
        renderTable(shifts);
        resetForm();
        clearErrors();

        userInputEl.focus(); // NEW: фокус після успішного додавання
    });

    resetBtn.addEventListener("click", () => {
        resetForm();
        clearErrors();
        userInputEl.focus(); // NEW: після очистки теж зручно ставити фокус
    });

    tbody.addEventListener("click", (event) => {
        const target = event.target;
        if (!target.classList.contains("delete-btn")) return;

        const id = Number(target.dataset.id);
        deleteShiftById(id);
        renderTable(shifts);
    });

// Первинний рендер
    renderTable(shifts);

// READ (зчитати форму)
    function readForm() {
        return {
            userName: document.getElementById("userInput").value,
            date: document.getElementById("dateInput").value,
            timeFrom: document.getElementById("timeFromInput").value,
            timeTo: document.getElementById("timeToInput").value
        };
    }

// VALIDATE (валідація)
    function validate(dto) {
        clearErrors();
        let isValid = true;

        const user = dto.userName.trim();

        if (user === "") {
            showError("userInput", "userError", "Поле є обов’язковим.");
            isValid = false;
        } else if (user.length < 3) {
            showError("userInput", "userError", "Мінімум 3 символи.");
            isValid = false;
        } else if (user.length > 30) {
            showError("userInput", "userError", "Максимум 30 символів.");
            isValid = false;
        }

        if (dto.date === "") {
            showError("dateInput", "dateError", "Вкажіть дату.");
            isValid = false;
        }

        if (dto.timeFrom === "") {
            showError("timeFromInput", "timeFromError", "Вкажіть час початку.");
            isValid = false;
        }

        if (dto.timeTo === "") {
            showError("timeToInput", "timeToError", "Вкажіть час завершення.");
            isValid = false;
        }

        if (dto.timeFrom !== "" && dto.timeTo !== "" && dto.timeTo <= dto.timeFrom) {
            showError("timeToInput", "timeToError", "Час завершення має бути пізніше часу початку.");
            isValid = false;
        }

        // Захист від дублювання
        if (isValid) {
            const isDuplicate = shifts.some(x =>
                x.userName === user &&
                x.date === dto.date &&
                x.timeFrom === dto.timeFrom &&
                x.timeTo === dto.timeTo
            );

            if (isDuplicate) {
                showError("userInput", "userError", "Такий запис уже існує.");
                isValid = false;
            }
        }

        return isValid;
    }

// UPDATE (зміни state)
    function addShift(dto) {
        const item = {
            id: nextId++,
            userName: dto.userName.trim(),
            date: dto.date,
            timeFrom: dto.timeFrom,
            timeTo: dto.timeTo
        };

        shifts.push(item);
    }

    function deleteShiftById(id) {
        shifts = shifts.filter(x => x.id !== id);
    }

// RENDER (оновити UI)
    function renderTable(items) {
        const rowsHtml = items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.userName}</td>
      <td>${item.date}</td>
      <td>${item.timeFrom} – ${item.timeTo}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${item.id}">
          Видалити
        </button>
      </td>
    </tr>
  `).join("");

        tbody.innerHTML = rowsHtml;
    }

// UI HELPERS (помилки/форма)
    function showError(inputId, errorId, message) {
        document.getElementById(inputId).classList.add("invalid");
        document.getElementById(errorId).innerText = message;
    }

    function clearError(inputId, errorId) {
        document.getElementById(inputId).classList.remove("invalid");
        document.getElementById(errorId).innerText = "";
    }

    function clearErrors() {
        clearError("userInput", "userError");
        clearError("dateInput", "dateError");
        clearError("timeFromInput", "timeFromError");
        clearError("timeToInput", "timeToError");
    }

    function resetForm() {
        form.reset();
    }
}