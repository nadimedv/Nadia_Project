import {
    createShift,
    getShiftById,
    getShiftList,
    removeShift,
    updateShift
} from "./apiClient.js";
import type { ApiError, CreateShiftDto, FieldError, ShiftDto, ShiftStatus, TimeSlot } from "./dtos.js";

type ListStatus = "idle" | "loading" | "success" | "empty" | "error";
type SortValue = "dateAsc" | "dateDesc" | "userAsc" | "statusAsc";

const state: {
    items: ShiftDto[];
    status: ListStatus;
    error: ApiError | null;
    editingId: number | null;
    filters: {
        userName: string;
        status: string;
        sort: SortValue;
    };
} = {
    items: [],
    status: "idle",
    error: null,
    editingId: null,
    filters: {
        userName: "",
        status: "",
        sort: "dateDesc"
    }
};

const form = getEl<HTMLFormElement>("createForm");
const tbody = getEl<HTMLTableSectionElement>("itemsTableBody");
const resetBtn = getEl<HTMLButtonElement>("resetBtn");
const cancelEditBtn = getEl<HTMLButtonElement>("cancelEditBtn");
const submitBtn = getEl<HTMLButtonElement>("submitBtn");
const emptyState = getEl<HTMLParagraphElement>("emptyState");
const listStatusEl = getEl<HTMLDivElement>("listStatus");
const noticeEl = getEl<HTMLDivElement>("notice");
const detailsEl = getEl<HTMLDivElement>("detailsPanel");
const reloadBtn = getEl<HTMLButtonElement>("reloadBtn");

const userInputEl = getEl<HTMLInputElement>("userInput");
const timeSlotSelectEl = getEl<HTMLSelectElement>("timeSlotSelect");
const dateInputEl = getEl<HTMLInputElement>("dateInput");
const commentInputEl = getEl<HTMLTextAreaElement>("commentInput");
const statusSelectEl = getEl<HTMLSelectElement>("statusSelect");

const searchInputEl = getEl<HTMLInputElement>("searchInput");
const statusFilterSelectEl = getEl<HTMLSelectElement>("statusFilterSelect");
const sortSelectEl = getEl<HTMLSelectElement>("sortSelect");

init();

function getEl<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element #${id} not found`);
    return el as T;
}

function init(): void {
    sortSelectEl.value = state.filters.sort;
    bindEvents();
    void loadList();
    userInputEl.focus();
}

function bindEvents(): void {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveForm();
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

    reloadBtn.addEventListener("click", () => {
        void loadList();
    });

    tbody.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;

        const id = Number(target.dataset.id);
        if (!Number.isFinite(id)) return;

        if (target.classList.contains("details-btn")) {
            void showDetails(id);
            return;
        }

        if (target.classList.contains("edit-btn")) {
            void startEdit(id);
            return;
        }

        if (target.classList.contains("delete-btn")) {
            void deleteShiftById(id);
        }
    });

    searchInputEl.addEventListener("input", () => {
        state.filters.userName = searchInputEl.value;
        void loadList();
    });

    statusFilterSelectEl.addEventListener("change", () => {
        state.filters.status = statusFilterSelectEl.value;
        void loadList();
    });

    sortSelectEl.addEventListener("change", () => {
        state.filters.sort = sortSelectEl.value as SortValue;
        void loadList();
    });
}

async function loadList(): Promise<void> {
    setListState("loading");
    renderTable([]);

    try {
        const items = await getShiftList(buildApiQuery());
        state.items = items;

        if (items.length === 0) {
            setListState("empty");
            renderTable([]);
            return;
        }

        setListState("success");
        renderTable(items);
    } catch (error) {
        state.items = [];
        setListState("error", error as ApiError);
        renderTable([]);
    }
}

function buildApiQuery(): Record<string, string> {
    const params: Record<string, string> = {};

    if (state.filters.userName.trim() !== "") {
        params.userName = state.filters.userName.trim();
    }

    if (state.filters.status !== "") {
        params.status = state.filters.status;
    }

    if (state.filters.sort === "dateAsc") {
        params.sortBy = "date";
        params.order = "asc";
    } else if (state.filters.sort === "dateDesc") {
        params.sortBy = "date";
        params.order = "desc";
    } else if (state.filters.sort === "userAsc") {
        params.sortBy = "userName";
        params.order = "asc";
    } else if (state.filters.sort === "statusAsc") {
        params.sortBy = "status";
        params.order = "asc";
    }

    return params;
}

async function saveForm(): Promise<void> {
    clearErrors();
    clearNotice();

    const dto = readForm();
    if (!validateForm(dto)) return;

    setFormEnabled(false);

    try {
        if (state.editingId === null) {
            await createShift(dto);
            showNotice("Запис створено.", "success");
        } else {
            await updateShift(state.editingId, dto);
            showNotice("Запис оновлено.", "success");
        }

        exitEditMode();
        resetForm();
        await loadList();
    } catch (error) {
        const apiError = error as ApiError;
        applyServerValidationErrors(apiError);
        showNotice(formatApiError(apiError, "Не вдалося зберегти запис."), "error");
    } finally {
        setFormEnabled(true);
    }
}

async function showDetails(id: number): Promise<void> {
    detailsEl.replaceChildren("Завантаження деталей...");

    try {
        const item = await getShiftById(id);
        const title = document.createElement("h3");
        title.textContent = `Деталі запису, ID: ${item.id}`;

        const fields: Array<[string, string]> = [
            ["Дата", item.date ?? "-"],
            ["Часовий слот", item.timeSlot ?? "-"],
            ["Користувач", item.userName ?? "-"],
            ["Коментар", item.comment || "-"],
            ["Статус", statusLabel(item.status)]
        ];

        const nodes = fields.map(([label, value]) => {
            const p = document.createElement("p");
            const b = document.createElement("b");
            b.textContent = `${label}: `;
            p.append(b, document.createTextNode(value));
            return p;
        });

        detailsEl.replaceChildren(title, ...nodes);
    } catch (error) {
        const p = document.createElement("p");
        p.className = "error-box";
        p.textContent = formatApiError(error as ApiError, "Не вдалося завантажити деталі.");
        detailsEl.replaceChildren(p);
    }
}

async function startEdit(id: number): Promise<void> {
    clearErrors();
    clearNotice();

    try {
        const item = await getShiftById(id);
        state.editingId = item.id;

        userInputEl.value = item.userName ?? "";
        timeSlotSelectEl.value = String(item.timeSlot ?? "") as TimeSlot;
        dateInputEl.value = item.date ?? "";
        commentInputEl.value = item.comment ?? "";
        statusSelectEl.value = String(item.status ?? "planned") as ShiftStatus;

        submitBtn.innerText = "Зберегти";
        cancelEditBtn.classList.remove("hidden");
        userInputEl.focus();
    } catch (error) {
        showNotice(formatApiError(error as ApiError, "Не вдалося відкрити запис для редагування."), "error");
    }
}

async function deleteShiftById(id: number): Promise<void> {
    const confirmed = window.confirm("Видалити це чергування?");
    if (!confirmed) return;

    setTableButtonsEnabled(false);

    try {
        await removeShift(id);
        if (state.editingId === id) {
            exitEditMode();
            resetForm();
        }
        showNotice("Запис видалено.", "success");
        await loadList();
    } catch (error) {
        showNotice(formatApiError(error as ApiError, "Не вдалося видалити запис."), "error");
    } finally {
        setTableButtonsEnabled(true);
    }
}

function readForm(): CreateShiftDto {
    return {
        userName: userInputEl.value.trim(),
        timeSlot: timeSlotSelectEl.value as TimeSlot,
        date: dateInputEl.value,
        comment: commentInputEl.value.trim(),
        status: statusSelectEl.value as ShiftStatus
    };
}

function validateForm(dto: CreateShiftDto): boolean {
    let isValid = true;

    if (dto.userName === "") {
        showError("userInput", "userError", "Поле є обов’язковим.");
        isValid = false;
    } else if (dto.userName.length < 2) {
        showError("userInput", "userError", "Мінімум 2 символи.");
        isValid = false;
    } else if (dto.userName.length > 30) {
        showError("userInput", "userError", "Максимум 30 символів.");
        isValid = false;
    }

    if (dto.timeSlot === "" as TimeSlot) {
        showError("timeSlotSelect", "timeSlotError", "Оберіть часовий слот.");
        isValid = false;
    }

    if (dto.date === "") {
        showError("dateInput", "dateError", "Вкажіть дату.");
        isValid = false;
    }

    if (!["planned", "done", "canceled"].includes(dto.status)) {
        showError("statusSelect", "statusError", "Оберіть статус.");
        isValid = false;
    }

    if ((dto.comment ?? "").length > 300) {
        showError("commentInput", "commentError", "Максимум 300 символів.");
        isValid = false;
    }

    return isValid;
}

function applyServerValidationErrors(error: ApiError): void {
    const fieldMap: Record<string, { inputId: string; errorId: string }> = {
        userName: { inputId: "userInput", errorId: "userError" },
        timeSlot: { inputId: "timeSlotSelect", errorId: "timeSlotError" },
        date: { inputId: "dateInput", errorId: "dateError" },
        comment: { inputId: "commentInput", errorId: "commentError" },
        status: { inputId: "statusSelect", errorId: "statusError" }
    };

    if (Array.isArray(error.errors)) {
        for (const item of error.errors as FieldError[]) {
            const target = fieldMap[item.field];
            if (target) showError(target.inputId, target.errorId, item.message);
        }
    }
}

function setListState(status: ListStatus, error: ApiError | null = null): void {
    state.status = status;
    state.error = error;
    renderListStatus();
}

function renderListStatus(): void {
    listStatusEl.className = "list-status";

    if (state.status === "loading") {
        listStatusEl.innerText = "Завантаження...";
        emptyState.classList.add("hidden");
        return;
    }

    if (state.status === "empty") {
        listStatusEl.innerText = "";
        emptyState.classList.remove("hidden");
        return;
    }

    if (state.status === "error") {
        listStatusEl.classList.add("error-box");
        listStatusEl.innerText = formatApiError(state.error, "Помилка завантаження.");
        emptyState.classList.add("hidden");
        return;
    }

    listStatusEl.innerText = "";
    emptyState.classList.add("hidden");
}

function renderTable(items: ShiftDto[]): void {
    const rows = items.map((item, index) => {
        const tr = document.createElement("tr");

        const values = [
            String(index + 1),
            item.date ?? "-",
            item.timeSlot ?? "-",
            item.userName ?? "-",
            item.comment || "-",
            statusLabel(item.status)
        ];

        for (const value of values) {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        }

        const actionsTd = document.createElement("td");
        const detailsBtn = document.createElement("button");
        detailsBtn.type = "button";
        detailsBtn.className = "details-btn";
        detailsBtn.dataset.id = String(item.id);
        detailsBtn.textContent = "Деталі";

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

        actionsTd.append(detailsBtn, editBtn, deleteBtn);
        tr.appendChild(actionsTd);
        return tr;
    });

    tbody.replaceChildren(...rows);
}

function exitEditMode(): void {
    state.editingId = null;
    submitBtn.innerText = "Додати";
    cancelEditBtn.classList.add("hidden");
}

function resetForm(): void {
    form.reset();
    statusSelectEl.value = "planned";
}

function setFormEnabled(isEnabled: boolean): void {
    const elements = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement>(
        "input, select, textarea, button"
    );

    elements.forEach((el) => {
        el.disabled = !isEnabled;
    });

    if (state.editingId === null) {
        cancelEditBtn.classList.add("hidden");
    }
}

function setTableButtonsEnabled(isEnabled: boolean): void {
    const buttons = tbody.querySelectorAll<HTMLButtonElement>("button");
    buttons.forEach((button) => {
        button.disabled = !isEnabled;
    });
}

function showError(inputId: string, errorId: string, message: string): void {
    getEl<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(inputId).classList.add("invalid");
    getEl<HTMLParagraphElement>(errorId).innerText = message;
}

function clearError(inputId: string, errorId: string): void {
    getEl<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(inputId).classList.remove("invalid");
    getEl<HTMLParagraphElement>(errorId).innerText = "";
}

function clearErrors(): void {
    clearError("userInput", "userError");
    clearError("timeSlotSelect", "timeSlotError");
    clearError("dateInput", "dateError");
    clearError("commentInput", "commentError");
    clearError("statusSelect", "statusError");
}

function showNotice(text: string, type: "success" | "error"): void {
    noticeEl.className = type === "success" ? "notice success-box" : "notice error-box";
    noticeEl.innerText = text;

    window.setTimeout(() => {
        clearNotice();
    }, 5000);
}

function clearNotice(): void {
    noticeEl.className = "notice";
    noticeEl.innerText = "";
}

function formatApiError(error: ApiError | null, fallback: string): string {
    if (!error) return fallback;

    const detail = error.detail ?? error.details;
    const detailText = typeof detail === "string" && detail.trim() !== "" ? ` ${detail}` : "";
    const statusText = error.status !== undefined ? `(${error.status}) ` : "";

    return `${fallback} ${statusText}${error.message ?? "Невідома помилка"}.${detailText}`;
}

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        planned: "Заплановано",
        done: "Виконано",
        canceled: "Скасовано"
    };

    return labels[status] ?? "Невідомо";
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
