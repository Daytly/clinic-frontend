export interface DRFErrorField {
    field: string;
    messages: string[];
}

export interface ParsedDRFError {
    nonFieldErrors: string[];
    fieldErrors: Record<string, string[]>;
    detail?: string;
}

export function parseDRFError(error: any): ParsedDRFError {
    const result: ParsedDRFError = {
        nonFieldErrors: [],
        fieldErrors: {},
    };

    const data = error?.response?.data || error?.data || error;

    if (!data || typeof data !== 'object') {
        result.detail = data?.detail || error?.message || 'Произошла ошибка';
        return result;
    }

    for (const [key, value] of Object.entries(data)) {
        if (key === 'non_field_errors' || key === 'nonFieldErrors') {
            result.nonFieldErrors = Array.isArray(value)
                ? value.map(String)
                : [String(value)];
        } else if (key === 'detail') {
            result.detail = String(value);
        } else if (Array.isArray(value)) {
            // Поле с массивом сообщений: { phone: ["Ошибка 1", "Ошибка 2"] }
            result.fieldErrors[key] = value.map(String);
        } else if (typeof value === 'string') {
            // Поле с одной строкой: { phone: "Ошибка" }
            result.fieldErrors[key] = [value];
        } else if (typeof value === 'object' && value !== null) {
            // Вложенные ошибки (например, в сериализаторах с nested data)
            result.fieldErrors[key] = [JSON.stringify(value)];
        }
    }

    return result;
}

/**
 * Форматирует ошибки поля в одну строку для отображения
 */
export function formatFieldErrors(messages: string[]): string {
    return messages.join(' ');
}

/**
 * Получает первую ошибку для быстрого отображения в toast
 */
export function getFirstErrorMessage(parsed: ParsedDRFError): string {
    if (parsed.detail) return parsed.detail;
    if (parsed.nonFieldErrors.length > 0) return parsed.nonFieldErrors[0];

    const firstField = Object.entries(parsed.fieldErrors)[0];
    if (firstField) {
        const [fieldName, messages] = firstField;
        const readableName = fieldName.replace(/_/g, ' ');
        return `${readableName}: ${messages[0]}`;
    }

    return 'Произошла ошибка';
}