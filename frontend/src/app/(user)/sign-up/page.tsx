"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateSignUp } from "@/app/lib/userValidation";


export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();


    function handleSignUp(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationMessage = validateSignUp(email, password, firstName, lastName, phoneNumber);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }
        // TODO: call an API to create the new user
        setErrorMessage("");
        router.push("/"); // Redirect to customer's profile

    }
    return (
        <>
            <div className="m-1 p-5 flex flex-col items-center">
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <form
                onSubmit={handleSignUp}
                className="m-1 p-5 border border-blue-500 rounded shadow-blue-800 flex flex-col items-center"
                >
                    <h1>Sign Up</h1>
                    <label htmlFor="email-text">Email:</label>
                    <input
                        id="email-text"
                        type="email"
                        className="m-1 bg-gray-50 p-1 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <label htmlFor="password-text">Password:</label>
                    <input
                        id="password-text"
                        type="password"
                        className="m-1 bg-gray-50 p-1 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <label htmlFor="first-name-text">First Name:</label>
                    <input
                        id="first-name-text"
                        type="text"
                        className="m-1 bg-gray-50 p-1 border border-gray-300 rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <br />
                    <label htmlFor="last-name-text">Last Name:</label>
                    <input
                        id="last-name-text"
                        type="text"
                        className="m-1 bg-gray-50 p-1 border border-gray-300 rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <br />
                    <label htmlFor="phone-number-text">Phone Number:</label>
                    <input
                        id="phone-number-text"
                        type="text"
                        className="m-1 bg-gray-50 p-1 border border-gray-300 rounded"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <br />
                    <button
                        type="submit"
                        className="m-1 p-1 border border-gray-300 rounded bg-gray-200 shadow-md"
                    >Sign Up</button>
                </form>

            </div>
        </>
    );
}