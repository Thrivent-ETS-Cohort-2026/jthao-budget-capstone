import { Account, CreateAccountRequest, UpdateAccountRequest } from "@/app/types/account";
import { handleApiResponse } from "./errorHandling";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAccounts(id: number, sessionUuid: string): Promise<Account[]> {
    const response = await fetch(`${API_BASE_URL}/account/${id}/all`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    const accounts: Account[] = await response.json();
    return accounts;
}

export async function createAccount(request: CreateAccountRequest, sessionUuid: string): Promise<Account> {
    const response = await fetch(`${API_BASE_URL}/account/create`, {
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

export async function deleteAccount(id: number, sessionUuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
        method: "DELETE",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
}

export async function updateAccount(id: number, data: UpdateAccountRequest, sessionUuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "X-Session-Token": sessionUuid
        },
        body: JSON.stringify(data),
    });
    await handleApiResponse(response);
}

export async function getAccount(id: number, sessionUuid: string): Promise<Account> {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
        method: "GET",
        headers: {
            "X-Session-Token": sessionUuid
        }
    });
    await handleApiResponse(response);
    return response.json();
}