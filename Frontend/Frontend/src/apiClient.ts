import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config.js";
import type {
    ApiError,
    CreateShiftDto,
    ItemResponse,
    ListResponse,
    ShiftDto,
    UpdateShiftDto
} from "./dtos.js";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeErrorPayload(status: number, rawText: string): ApiError {
    let payload: unknown = null;

    try {
        payload = rawText ? JSON.parse(rawText) : null;
    } catch {
        payload = null;
    }

    if (isObject(payload)) {
        const nested = isObject(payload.error) ? payload.error : null;

        return {
            status,
            code: String(payload.code ?? nested?.code ?? "HTTP_ERROR"),
            message: String(payload.message ?? nested?.message ?? "HTTP помилка"),
            detail: payload.detail ?? nested?.details ?? rawText,
            details: payload.detail ?? nested?.details ?? rawText,
            errors: payload.errors as ApiError["errors"]
        };
    }

    return {
        status,
        code: "HTTP_ERROR",
        message: "HTTP помилка",
        detail: rawText || `HTTP ${status}`,
        details: rawText || `HTTP ${status}`
    };
}

function buildHeaders(options: RequestInit): HeadersInit {
    return {
        "X-Demo-UserId": localStorage.getItem("demoUserId") || "1",
        ...(options.headers ?? {})
    };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const url = `${API_BASE_URL}${path}`;

    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            headers: buildHeaders(options),
            signal: controller.signal
        });
    } catch (error) {
        const isAbort = error instanceof DOMException && error.name === "AbortError";

        throw {
            status: 0,
            code: isAbort ? "REQUEST_TIMEOUT" : "NETWORK_OR_CORS_ERROR",
            message: isAbort
                ? "Запит перевищив ліміт часу"
                : "Помилка мережі або CORS",
            detail: isAbort
                ? "Перевірте, чи бекенд не завис, і повторіть дію."
                : error instanceof Error ? error.message : String(error)
        } satisfies ApiError;
    } finally {
        window.clearTimeout(timeoutId);
    }

    if (response.status === 204) {
        if (!response.ok) {
            throw {
                status: response.status,
                code: "HTTP_ERROR",
                message: "HTTP помилка",
                detail: "No Content"
            } satisfies ApiError;
        }

        return null as T;
    }

    const rawText = await response.text();

    if (response.ok) {
        if (!rawText) return null as T;

        try {
            return JSON.parse(rawText) as T;
        } catch {
            return rawText as T;
        }
    }

    throw normalizeErrorPayload(response.status, rawText);
}

function buildQuery(params: Record<string, string>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value.trim() !== "") searchParams.set(key, value);
    }

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

export async function getShiftList(params: Record<string, string> = {}): Promise<ShiftDto[]> {
    const response = await request<ListResponse<ShiftDto>>(`/shifts${buildQuery(params)}`, {
        method: "GET"
    });

    return response.items;
}

export async function getShiftById(id: number): Promise<ShiftDto> {
    const response = await request<ItemResponse<ShiftDto>>(`/shifts/${encodeURIComponent(id)}`, {
        method: "GET"
    });

    return response.item;
}

export async function createShift(dto: CreateShiftDto): Promise<ShiftDto> {
    const response = await request<ItemResponse<ShiftDto>>("/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    return response.item;
}

export async function updateShift(id: number, dto: UpdateShiftDto): Promise<ShiftDto> {
    const response = await request<ItemResponse<ShiftDto>>(`/shifts/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    return response.item;
}

export async function removeShift(id: number): Promise<void> {
    await request<void>(`/shifts/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}
