
export async function handleApiResponse(response: Response): Promise<void> {
    if (response.ok) return;

    const errorText = await response.text();
    const errorMessage = getResponseErrorMessage(errorText);

    if (response.status === 401) {
        throw new Error(errorMessage || "Your session has expired. Please log in again.");
    }

    if (response.status === 403) {
        throw new Error(errorMessage || "You do not have permission to perform this action.");
    }

    if (response.status === 404) {
        throw new Error(errorMessage || "The requested resource could not be found.");
    }

    if (response.status === 400 || response.status === 409 || response.status === 422) {
        throw new Error(errorMessage || "Please check your information and try again.");
    }

    if (response.status >= 500) {
        throw new Error("An unexpected server error occurred. Please try again later.");
    }

    throw new Error(errorMessage || "An error occurred while processing your request.");
}

function getResponseErrorMessage(errorText: string): string {
    const trimmedText = errorText.trim();

    if (!trimmedText) {
        return "";
    }

    try {
        const responseBody: unknown = JSON.parse(trimmedText);

        if (typeof responseBody === "string") {
            return responseBody.trim();
        }

        if (responseBody && typeof responseBody === "object") {
            const body = responseBody as {
                message?: unknown;
                detail?: unknown;
                title?: unknown;
            };

            for (const value of [body.message, body.detail, body.title]) {
                if (typeof value === "string" && value.trim()) {
                    return value.trim();
                }
            }
        }

        return "";
    } catch {
        return trimmedText;
    }
}

export function getApiErrorMessage(error: unknown): string {
    if (error instanceof TypeError) {
        return "Unable to connect to the server. Please check your connection and try again.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred. Please try again.";
}
