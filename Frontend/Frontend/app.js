// STATE
const STORAGE_KEY = "lr1_shifts_v11";

let shifts = [];
let nextId = 1;

const ui = {
    search: "",
    typeFilter: "",
    sort: "dateAsc"
};

let editingId = null; // якщо не null — ми в режимі редагування

// DOM
const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const emptyState = document.getElementById("emptyState");

const userInputEl = document.getElementById("userInput");
const typeSelectEl = document.getElementById("typeSelect");
const dateInputEl = document.getElementById("dateInput");
const timeFromEl = document.getElementById("timeFromInput");
const timeToEl = document.getElementById("timeToInput");

const searchInputEl = document.getElementById("searchInput");
const typeFilterSelectEl = document.getElementById("typeFilterSelect");
const sortSelectEl = document.getElementById("sortSelect");

// INIT (load -> render)
init();

function init() {
    shifts = loadFromStorage();
    nextId = computeNextId(shifts);

    // UI дефолти
    sortSelectEl.value = ui.sort;

    render();
    userInputEl.focus();
}

// HANDLERS
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const dto = readForm();
    const isValid = validate(dto);
    if (!isValid) return;

    if (editingId === null) {
        addShift(dto);
    } else {
        updateShift(editingId, dto);
    }

    saveToStorage(shifts);
    exitEditMode();
    resetForm();
    clearErrors();
    render();

    userInputEl.focus();
});

resetBtn.addEventListener("click", () => {
    resetForm();
    clearErrors();
    userInputEl.focus();
});

cancelEditBtn.addEventListener("click", () => {
    exitEditMode();
    resetForm();
    clearErrors();
    userInputEl.focus();
});

// Делегування подій для таблиці (edit/delete)
tbody.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        deleteShiftById(id);
        saveToStorage(shifts);
        render();
        return;
    }

    if (target.classList.contains("edit-btn")) {
        const id = Number(target.dataset.id);
        startEdit(id);
        return;
    }
});

// Пошук/фільтр/сортування
searchInputEl.addEventListener("input", () => {
    ui.search = searchInputEl.value;
    render();
});

typeFilterSelectEl.addEventListener("change", () => {
    ui.typeFilter = typeFilterSelectEl.value;
    render();
});

sortSelectEl.addEventListener("change", () => {
    ui.sort = sortSelectEl.value;
    render();
});

// READ
function readForm() {
    return {
        userName: userInputEl.value,
        type: typeSelectEl.value,
        date: dateInputEl.value,
        timeFrom: timeFromEl.value,
        timeTo: timeToEl.value
    };
}

// VALIDATE + UX
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

    if (dto.type === "") {
        showError("typeSelect", "typeError", "Оберіть тип зі списку.");
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

    // Захист від дублювання (ігноруємо поточний запис під час редагування)
    if (isValid) {
        const isDuplicate = shifts.some(x => {
            if (editingId !== null && x.id === editingId) return false;

            return (
                x.userName === user &&
                x.type === dto.type &&
                x.date === dto.date &&
                x.timeFrom === dto.timeFrom &&
                x.timeTo === dto.timeTo
            );
        });

        if (isDuplicate) {
            showError("userInput", "userError", "Такий запис уже існує.");
            isValid = false;
        }
    }

    return isValid;
}

// UPDATE (CRUD)
function addShift(dto) {
    const item = {
        id: nextId++,
        userName: dto.userName.trim(),
        type: dto.type,
        date: dto.date,
        timeFrom: dto.timeFrom,
        timeTo: dto.timeTo
    };
    shifts.push(item);
}

function updateShift(id, dto) {
    const item = shifts.find(x => x.id === id);
    if (!item) return;

    item.userName = dto.userName.trim();
    item.type = dto.type;
    item.date = dto.date;
    item.timeFrom = dto.timeFrom;
    item.timeTo = dto.timeTo;
}

function deleteShiftById(id) {
    shifts = shifts.filter(x => x.id !== id);
    // після видалення краще вийти з редагування, якщо редагували цей запис
    if (editingId === id) exitEditMode();
}

// EDIT MODE
function startEdit(id) {
    const item = shifts.find(x => x.id === id);
    if (!item) return;

    editingId = id;

    // підставляємо значення в форму
    userInputEl.value = item.userName;
    typeSelectEl.value = item.type;
    dateInputEl.value = item.date;
    timeFromEl.value = item.timeFrom;
    timeToEl.value = item.timeTo;

    clearErrors();

    submitBtn.innerText = "Зберегти";
    cancelEditBtn.classList.remove("hidden");

    userInputEl.focus();
}

function exitEditMode() {
    editingId = null;
    submitBtn.innerText = "Додати";
    cancelEditBtn.classList.add("hidden");
}

// RENDER (with search/filter/sort)
function render() {
    const items = getVisibleItems();
    renderTable(items);

    const hasRows = items.length > 0;
    emptyState.classList.toggle("hidden", hasRows);
}

function getVisibleItems() {
    let items = [...shifts];

    const q = ui.search.trim().toLowerCase();
    if (q !== "") {
        items = items.filter(x => x.userName.toLowerCase().includes(q));
    }

    if (ui.typeFilter !== "") {
        items = items.filter(x => x.type === ui.typeFilter);
    }

    // sort
    if (ui.sort === "dateAsc") {
        items.sort((a, b) => (a.date + a.timeFrom).localeCompare(b.date + b.timeFrom));
    } else if (ui.sort === "dateDesc") {
        items.sort((a, b) => (b.date + b.timeFrom).localeCompare(a.date + a.timeFrom));
    } else if (ui.sort === "userAsc") {
        items.sort((a, b) => a.userName.localeCompare(b.userName, "uk"));
    }

    return items;
}

function renderTable(items) {
    const rows = items.map((item, index) => {
        const tr = document.createElement("tr");

        const values = [
            String(index + 1),
            item.userName,
            item.type,
            item.date,
            `${item.timeFrom} – ${item.timeTo}`
        ];

        values.forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        const actionsTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = String(item.id);
        editBtn.textContent = "Редагувати";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = String(item.id);
        deleteBtn.textContent = "Видалити";

        actionsTd.append(editBtn, deleteBtn);
        tr.appendChild(actionsTd);
        return tr;
    });

    tbody.replaceChildren(...rows);
}

// UI HELPERS
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
    clearError("typeSelect", "typeError");
    clearError("dateInput", "dateError");
    clearError("timeFromInput", "timeFromError");
    clearError("timeToInput", "timeToError");
}

function resetForm() {
    form.reset();
    // після reset() select повертається на перший option (порожній)
}

// localStorage
function saveToStorage(items) {
    const json = JSON.stringify(items);
    localStorage.setItem(STORAGE_KEY, json);
}

function loadFromStorage() {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json === null) return [];

    try {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function computeNextId(items) {
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(x => x.id));
    return maxId + 1;
}