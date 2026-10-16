"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Account, AccountType, ACCOUNT_TYPES } from "@/app/types/account";
import { getAccount, updateAccount } from "@/app/lib/api/accounts";

function UpdateAccountForm() {
    const router = useRouter();
    const params = useParams();
    const accountId: number = Number(params.id);
    const { user } = useUser();

    const [accountName, setAccountName] = useState<string>("");
    const [accountType, setAccountType] = useState<AccountType | "">("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            if (!user?.id || !accountId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const accountResponse: Account = await getAccount(accountId);
                setAccountName(accountResponse.accountName);
                setAccountType(accountResponse.accountType);
            } catch (error) {
                console.error("Failed to fetch account data:", error);
                setErrorMessage((error as Error).message || "Failed to load account.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, accountId]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const requestData = {
            accountName,
            accountType: accountType as AccountType,
            userId: user?.id as number,
        };

        try {
            await updateAccount(accountId, requestData);
            
            setAccountName("");
            setAccountType("");
            router.push("/dashboard");
        } catch (error) {
            console.error("Error updating account:", error);
            setErrorMessage((error as Error).message || "Failed to update account.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading account...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Edit Account</h1>
            </div>

            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Account Name</label>
                    <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Account Type</label>
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value as AccountType)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Account Type</option>
                        {ACCOUNT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function UpdateAccountPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-screen bg-gray-50">
                    <p className="text-gray-600 text-base">Loading...</p>
                </div>
            }
        >
            <UpdateAccountForm />
        </Suspense>
    );
}