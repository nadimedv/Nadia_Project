let shifts = [];
let nextId = 1;

const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // щоб сторінка не перезавантажувалась

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

renderTable(shifts);

function readForm() {
    return {
        userName: document.getElementById("userInput").value,
        date: document.getElementById("dateInput").value,
        timeFrom: document.getElementById("timeFromInput").value,
        timeTo: document.getElementById("timeToInput").value
    };
}

// мінімальна валідація
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

function renderTable(items) {
    const rowsHtml = items
        .map((item, index) => {
            return `
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
            `;
        })
        .join("");

    tbody.innerHTML = rowsHtml;
}

function resetForm() {
    form.reset();
}