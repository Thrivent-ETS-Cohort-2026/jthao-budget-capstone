"use client"

import { useState } from "react";
import { validateUser } from "@/app/lib/userValidation";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { validateUserLogin } from "@/app/lib/api/user";
import { User } from "@/app/types/user";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();
    const { setUser } = useUser();

    async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationMessage: string = validateUser(email, password);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }
        setErrorMessage("");
        const user: User = await validateUserLogin(email, password);
        if (!user) {
            setErrorMessage("Account does not exist.");
            return;
        }
        setUser(user);
        setErrorMessage("");
        setEmail("");
        setPassword("");
        router.push("../dashboard");
    }

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl mt-10">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Log In</h1>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form onSubmit={handleLogin} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label htmlFor="email-text" className="text-gray-700 mb-1 block">Email:</label>
                    <input
                        id="email-text"
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password-text" className="text-gray-700 mb-1 block">Password:</label>
                    <input
                        id="password-text"
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
}