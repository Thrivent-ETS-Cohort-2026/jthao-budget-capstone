import { Budget, CreateBudgetRequest } from "@/app/types/budget";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBudgets(id: number): Promise<Budget[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/budget/user/${id}`);
        if (!response.ok) {
            throw new Error("Failed to get budgets");
        }
        const budgets: Budget[] = await response.json();
        return budgets;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function createBudget(request: CreateBudgetRequest): Promise<Budget> {
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