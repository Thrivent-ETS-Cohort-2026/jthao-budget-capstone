
import { Transaction, CreateTransactionRequest } from "@/app/types/transaction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function  exportTransactions(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/transactions/export`);
    if (!response.ok) {
        throw new Error("Failed to export transactons");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
}

export async function getTransactions(id: number): Promise<Transaction[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/transaction/${id}/all`);
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
        const response = await fetch(`${API_BASE_URL}/transaction/create`, {
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