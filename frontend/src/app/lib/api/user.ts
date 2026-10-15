

import { UserFormRequest, User } from "../../types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function validateUserLogin(email: string, password: string): Promise<User> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // TODO: Check if we can use something like Spring Security for the token?
            },
            body: JSON.stringify({ email, password })
    });
        if (!response.ok) {
            throw new Error("Failed to validate user login");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function createUser(signUpRequest: UserFormRequest): Promise<User> {
    try {
        console.log("signUpRequest from api call: " + signUpRequest);
        const response = await fetch(`${API_BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signUpRequest)
    });
        if (!response.ok) {
            throw new Error("Failed to create user");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        throw new Error((error as Error).message); // TODO: figure out why it's breaking here
    }
}

export async function updateUser(updateUserRequest: UserFormRequest): Promise<User> {
    try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateUserRequest)
    });
        if (!response.ok) {
            throw new Error("Failed to create user");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}