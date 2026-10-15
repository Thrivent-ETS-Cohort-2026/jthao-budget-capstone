import { Account } from "@/app/types/account";

import { CreateAccountRequest } from "@/app/types/account";

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