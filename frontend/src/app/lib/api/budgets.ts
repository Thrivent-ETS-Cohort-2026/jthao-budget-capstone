import { Budget, BudgetRequest } from "@/app/types/budget";
import { handleApiResponse } from "./errorHandling";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBudgets(id: number, sessionUuid: string): Promise<Budget[]> {
    const response = await fetch(`${API_BASE_URL}/budget/${id}/all`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    const budgets: Budget[] = await response.json();
    return budgets;
}

export async function createBudget(request: BudgetRequest, sessionUuid: string): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budget/create`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-Session-Token": sessionUuid
        },
        body: JSON.stringify(request),
    });
    await handleApiResponse(response);
    return await response.json();
}

export async function deleteBudget(id: number, sessionUuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: "DELETE",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
}

export async function getBudget(id: number, sessionUuid: string): Promise<Budget> {
    const response: Response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    return await response.json();
}

export async function updateBudget(id: number, request: BudgetRequest, sessionUuid: string): Promise<void> {
    const response: Response = await fetch(`${API_BASE_URL}/budget/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "X-Session-Token": sessionUuid
        },
        body: JSON.stringify(request),
    });
    await handleApiResponse(response);
}