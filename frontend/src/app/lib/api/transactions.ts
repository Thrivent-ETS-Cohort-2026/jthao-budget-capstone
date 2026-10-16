
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from "@/app/types/transaction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function getTransactions(id: number): Promise<Transaction[]> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}/all`);
        if (!response.ok) {
            throw new Error("Failed to get transactions");
        }
        const transactions: Transaction[] = await response.json();
        return transactions;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/transaction/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error("Failed to create transaction");
        }
        return await response.json();
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function deleteTransaction(id: number): Promise<void> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/transaction/remove/${id}`, {
            method: "PATCH",
        });
        if (!response.ok) {
            throw new Error("Failed to delete transaction");
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function updateTransaction(id: number, updateRequest: UpdateTransactionRequest): Promise<void> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateRequest),
        });

        if (!response.ok) {
            throw new Error("Failed to update transaction.");
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getTransaction(id: number): Promise<Transaction> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}`);
        if (!response.ok) {
            throw new Error("Failed to get transactions");
        }
        console.log("got a transaction")
        const transaction: Transaction = await response.json();
        return transaction;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}