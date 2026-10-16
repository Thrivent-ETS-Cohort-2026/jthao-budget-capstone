
export async function handleApiResponse(response: Response): Promise<void> {
    if (response.ok) return;

    const errorText = await response.text();

    // Catch 500 errors or Spring Boot's default JSON error responses
    if (response.status === 500 || errorText.trim().startsWith("{")) {
        throw new Error("An unexpected server error occurred. Please try again later.");
    }

    // Otherwise, use the clean text message thrown by your backend (e.g., 409 Conflict, 400 Bad Request)
    throw new Error(errorText || "An error occurred while processing your request.");
}