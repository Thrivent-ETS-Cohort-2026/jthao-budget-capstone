"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateSignUp } from "@/app/lib/userValidation";
import { useUser } from "@/app/context/UserContext";

import { UserFormRequest, User } from "@/app/types/user";

import { createUser } from "@/app/lib/api/user"


export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [userFormRequest, setUserFormRequest] = useState<UserFormRequest>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });

    const router = useRouter();
    const { setUser } = useUser();

    async function handleSignUp(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationMessage = validateSignUp(email, password, firstName, lastName, phoneNumber);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }
        setUserFormRequest({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
        });
        console.log("From sign up page" + userFormRequest);
        // TODO: check why first sign up isn't working, 2nd time will work.
        const user: User = await createUser(userFormRequest);
        setUser(user);
        setErrorMessage("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setUserFormRequest({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: ""
        });
        router.push("../dashboard");
    }

    return (
        <div className="mx-auto max-w-xl p-6 space-y-6 mt-10">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
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
                <div>
                    <label htmlFor="first-name-text" className="text-gray-700 mb-1 block">First Name:</label>
                    <input
                        id="first-name-text"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="last-name-text" className="text-gray-700 mb-1 block">Last Name:</label>
                    <input
                        id="last-name-text"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="phone-number-text" className="text-gray-700 mb-1 block">Phone Number:</label>
                    <input
                        id="phone-number-text"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}