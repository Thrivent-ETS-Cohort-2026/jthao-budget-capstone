"use client"

import { useState } from "react";

import { useUser } from "@/app/context/UserContext";
import { UserFormRequest, User } from "@/app/types/user";
import { validateSignUp } from "@/app/lib/userValidation";
import { updateUser } from "@/app/lib/api/user"


export default function UserFromDashboard() {
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
    const { user } = useUser();

    async function handleUpdate(event: React.SubmitEvent<HTMLFormElement>) {
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
        // TODO: check why first sign up isn't working, 2nd time will work.
        const updatedUser: User = await updateUser(userFormRequest);
        // setUser(user);
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


    }

    return (
        <>
            <div className="m-1 p-5 flex flex-col items-center">
                <h2>Update your account information.</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <form
                    onSubmit={handleUpdate}
                    className="m-1 p-5 border border-gray-500 rounde "
                >
                    {/* <h1>Sign Up</h1> */}
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
                    >Update</button>
                </form>
            </div>
        </>
    );
}