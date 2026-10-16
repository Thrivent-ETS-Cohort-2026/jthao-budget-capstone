export async function handleApiResponse(response: Response): Promise<void> {
    if (response.ok) return;

    const errorText = await response.text();

    if (response.status === 401) {
        throw new Error(errorText || "Your session has expired. Please log in again.");
    }

    if (response.status === 500 || errorText.trim().startsWith("{")) {
        throw new Error("An unexpected server error occurred. Please try again later.");
    }

    throw new Error(errorText || "An error occurred while processing your request.");
}