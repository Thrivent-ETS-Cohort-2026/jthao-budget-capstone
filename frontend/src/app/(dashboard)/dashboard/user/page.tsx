"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { updateUser } from "@/app/lib/api/user";
import { UserFormRequest } from "@/app/types/user";
import { validateUpdateUser } from "@/app/lib/userValidation";

export default function UserProfilePage() {
    const router = useRouter();
    const { user, setUser } = useUser();

    const [firstName, setFirstName] = useState<string>(user?.firstName || "");
    const [lastName, setLastName] = useState<string>(user?.lastName || "");
    const [email, setEmail] = useState<string>(user?.email || "");
    const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || "");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Go to home page
                </button>
            </div>
        );
    }

    async function handleUpdate(event: React.SyntheticEvent) {
        event.preventDefault();
        if (!user) { return }

        const validationError = validateUpdateUser(email, password, firstName, lastName, phoneNumber);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const updateRequest: UserFormRequest = {
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
            };

            const updatedUser = await updateUser(user.id, updateRequest, user.sessionUuid || "");
            setUser({
                ...updatedUser,
                sessionUuid: user.sessionUuid
            });
            setSuccessMessage("Profile updated successfully!");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl mt-6 bg-white border border-gray-300 rounded">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label htmlFor="first-name" className="text-gray-700 mb-1">First Name:</label>
                    <input
                        id="first-name"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="last-name" className="text-gray-700 mb-1">Last Name:</label>
                    <input
                        id="last-name"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email-text" className="text-gray-700 mb-1">Email:</label>
                    <input
                        id="email-text"
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone-number" className="text-gray-700 mb-1">Phone Number:</label>
                    <input
                        id="phone-number"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password-text" className="text-gray-700 mb-1">New Password:</label>
                    <input
                        id="password-text"
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Leave blank to keep current password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}