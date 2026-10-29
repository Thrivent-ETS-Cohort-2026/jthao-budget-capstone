"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateSignUp } from "@/app/lib/userValidation";
import { useUser } from "@/app/context/UserContext";
import { UserFormRequest, User } from "@/app/types/user";
import { createUser } from "@/app/lib/api/user";

export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();
    const { setUser } = useUser();

    async function handleSignUp(event: React.SyntheticEvent) {
        event.preventDefault();

        const validationMessage = validateSignUp(email, password, firstName, lastName, phoneNumber);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        const requestData: UserFormRequest = {
            email,
            password,
            firstName,
            lastName,
            phoneNumber
        };

        try {
            const user: User = await createUser(requestData);
            setUser(user);
            setErrorMessage("");
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setPhoneNumber("");
            router.push("/dashboard");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to create account.");
        }
    }

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl mt-10 bg-white border border-orange-400">
            <div className="flex justify-between items-center p-6 border-b border-orange-300">
                <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form
                onSubmit={handleSignUp}
                className="border border-gray-300 p-6 rounded space-y-4"
            >
                <div>
                    <label htmlFor="email-text" className="text-gray-700 mb-1 block">Email:</label>
                    <input
                        id="email-text"
                        type="email"
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password-text" className="text-gray-700 mb-1 block">Password:</label>
                    <input
                        id="password-text"
                        type="password"
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="first-name-text" className="text-gray-700 mb-1 block">First Name:</label>
                    <input
                        id="first-name-text"
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last-name-text" className="text-gray-700 mb-1 block">Last Name:</label>
                    <input
                        id="last-name-text"
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone-number-text" className="text-gray-700 mb-1 block">Phone Number:</label>
                    <input
                        id="phone-number-text"
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        placeholder="Enter with no dashes"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-300">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="bg-orange-100 border border-orange-200 text-black p-2 rounded hover:bg-orange-200 hover:border-orange-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-orange-400 border border-orange-400 text-black p-2 rounded hover:bg-orange-500 hover:border-orange-600"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}