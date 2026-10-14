"use client"

import { useState } from "react";
import { validateUser } from "@/app/lib/userValidation";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { validateCustomerLogin } from "@/app/lib/api/user";
import { User } from "@/app/types/user";


export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();
    const {setUser} = useUser();

    async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationMessage: string = validateUser(email, password);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }
        setErrorMessage("");
        const user :User = await validateCustomerLogin(email, password);
        if (!user){
            setErrorMessage("Account does not exist.");
            return;
        }
        setUser(user);
        setErrorMessage("");
        router.push("../account"); // Redirect to customer's profile
    }

    return (
        <>
            <div className="m-1 p-5 flex flex-col items-center">
                <h1>Log In</h1>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <form onSubmit={handleLogin}>
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
                    <button
                        type="submit"
                        className="m-1 p-1 border border-gray-300 rounded bg-gray-200 shadow-md"
                    >Log In</button>
                </form>
            </div>
        </>
    );
}