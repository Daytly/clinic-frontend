// utils/drfErrors.ts

export interface ParsedDRFError {
    nonFieldErrors: string[];
    fieldErrors: Record<string, string[]>;
    detail?: string;
}

export function parseDRFError(error: any): ParsedDRFError {
    // 1. Поддержка вашего класса ApiError
    if (error?.name === 'ApiError') {
        if (error.rawData && typeof error.rawData === 'object') {
            return parseDRFData(error.rawData);
        }
        if (error.errors && typeof error.errors === 'object') {
            return parseDRFData(error.errors);
        }
    }

    // 2. Поддержка axios / fetch ответов
    const data = error?.response?.data || error?.data || error;
    if (data && typeof data === 'object') {
        return parseDRFData(data);
    }

    // 3. Фолбэк для текстовых ошибок
    return {
        nonFieldErrors: [],
        fieldErrors: {},
        detail: error?.message || error?.detail || String(error) || 'Произошла ошибка',
    };
}

// ✅ ИСПРАВЛЕНО: добавлено имя параметра `data`
function parseDRFData(data: Record<string, any>): ParsedDRFError {
    const result: ParsedDRFError = {
        nonFieldErrors: [],
        fieldErrors: {},
    };

    for (const [key, value] of Object.entries(data)) {
        if (key === 'non_field_errors' || key === 'nonFieldErrors') {
            result.nonFieldErrors = Array.isArray(value)
                ? value.map(String)
                : [String(value)];
        } else if (key === 'detail') {
            result.detail = String(value);
        } else if (Array.isArray(value)) {
            result.fieldErrors[key] = value.map(String);
        } else if (typeof value === 'string') {
            result.fieldErrors[key] = [value];
        } else if (typeof value === 'object' && value !== null) {
            // Вложенные ошибки (например, от вложенных сериализаторов DRF)
            result.fieldErrors[key] = [JSON.stringify(value)];
        }
    }

    return result;
}

export function formatFieldErrors(messages: string[]): string {
    return messages.join(' ');
}

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