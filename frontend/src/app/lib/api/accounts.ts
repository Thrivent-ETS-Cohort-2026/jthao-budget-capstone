import { Account, CreateAccountRequest, UpdateAccountRequest } from "@/app/types/account";

import { handleApiResponse } from "./errorHandling";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAccounts(id: number): Promise<Account[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/account/${id}/all`);
        if (!response.ok) {
            throw new Error("Failed to get accounts");
        }
        const accounts: Account[] = await response.json();
        return accounts;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function createAccount(request: CreateAccountRequest): Promise<Account> {
    try {
        const response = await fetch(`${API_BASE_URL}/account/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error("Failed to create account");
        }
        return await response.json();
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function deleteAccount(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
        method: "DELETE"
    });

   await handleApiResponse(response);
}

export async function updateAccount(id: number, data: UpdateAccountRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    await handleApiResponse(response);
}

export async function getAccount(id: number): Promise<Account> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`);
    
    await handleApiResponse(response);
    
    return response.json();
}