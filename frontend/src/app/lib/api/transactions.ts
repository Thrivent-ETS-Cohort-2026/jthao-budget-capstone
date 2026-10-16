import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from "@/app/types/transaction";
import { handleApiResponse } from "./errorHandling";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTransactions(id: number, sessionUuid: string): Promise<Transaction[]> {
    const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}/all`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    const transactions: Transaction[] = await response.json();
    return transactions;
}

export async function createTransaction(request: CreateTransactionRequest, sessionUuid: string): Promise<Transaction> {
    const response: Response = await fetch(`${API_BASE_URL}/transaction/create`, {
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

export async function deleteTransaction(id: number, sessionUuid: string): Promise<void> {
    const response: Response = await fetch(`${API_BASE_URL}/transaction/remove/${id}`, {
        method: "PATCH",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
}

export async function updateTransaction(id: number, updateRequest: UpdateTransactionRequest, sessionUuid: string): Promise<void> {
    const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "X-Session-Token": sessionUuid
        },
        body: JSON.stringify(updateRequest),
    });

    await handleApiResponse(response);
}

export async function getTransaction(id: number, sessionUuid: string): Promise<Transaction> {
    const response: Response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    const transaction: Transaction = await response.json();
    return transaction;
}