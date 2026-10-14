import { Account } from "@/app/types/account";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAccounts(id: number): Promise<Account[]>{
    try{
        console.log("inside the getAllAccounts call");
        const response = await fetch(`${API_BASE_URL}/account/${id}/all-accounts`);
        if (!response.ok) {
            throw new Error("Failed to get accounts");
        }
        const accounts: Account[] = await response.json();
        return accounts;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}