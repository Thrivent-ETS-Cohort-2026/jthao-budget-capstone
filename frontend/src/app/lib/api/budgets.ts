import { Budget, BudgetRequest } from "@/app/types/budget";
import { handleApiResponse } from "./errorHandling";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBudgets(id: number): Promise<Budget[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/budget/${id}/all`);
        if (!response.ok) {
            throw new Error("Failed to get budgets");
        }
        const budgets: Budget[] = await response.json();
        return budgets;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function createBudget(request: BudgetRequest): Promise<Budget> {
    try {
        const response = await fetch(`${API_BASE_URL}/budget/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error("Failed to create budget");
        }
        return await response.json();
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function deleteBudget(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: "DELETE",
    });
    await handleApiResponse(response);
}

export async function getBudget(id: number): Promise<Budget> {
    const response: Response = await fetch(`${API_BASE_URL}/budget/${id}`);
    await handleApiResponse(response);
    return await response.json();
}

export async function updateBudget(id: number, request: BudgetRequest): Promise<void> {
    const response: Response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    await handleApiResponse(response);
}

