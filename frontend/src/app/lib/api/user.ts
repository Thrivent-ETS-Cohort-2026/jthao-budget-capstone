import { handleApiResponse } from "./errorHandling";
import { UserFormRequest, User } from "../../types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Validates user's login credentials
export async function validateUserLogin(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    await handleApiResponse(response);
    const user: User = await response.json();
        return user;
}

// Signs users up and creates their profile
export async function createUser(signUpRequest: UserFormRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(signUpRequest)
    });
    await handleApiResponse(response);
    const user: User = await response.json();
        return user;
}

export async function updateUser(id: number, updateUserRequest: UserFormRequest, sessionUuid: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/update/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Session-Token": sessionUuid
        },
        body: JSON.stringify(updateUserRequest)
    });
    await handleApiResponse(response);
    const user: User = await response.json();
        return user;
}