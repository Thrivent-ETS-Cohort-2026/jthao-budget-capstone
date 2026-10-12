

import { User } from "../../types/User";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function validateCustomerLogin(email: string, password: string): Promise<User> {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
    });
        if (!response.ok) {
            throw new Error("Failed to validate customer login");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}