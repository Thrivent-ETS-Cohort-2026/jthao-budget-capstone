"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Account } from "@/app/types/account";
import { getAccount, updateAccount } from "@/app/lib/api/accounts";

function UpdateAccountForm() {
    const router = useRouter();
    const params = useParams();
    const accountId: number = Number(params.accountId);
    const { user } = useUser();

    const [accountName, setAccountName] = useState<string>("");
    const [accountType, setAccountType] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    console.log("user in update accounts: " + user);
    useEffect(() => {
        async function fetchData() {
            if (!user?.id || !accountId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const accRes: Account = await getAccount(accountId);
                setAccountName(accRes.accountName);
                setAccountType(accRes.accountType);
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
            accountType,
            userId: user?.id as number,
        };

        try {
            await updateAccount(accountId, requestData);
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
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
                >
                    Back to Dashboard
                </button>
            </div>

            {errorMessage && (
                <div className="p-3">
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
                    <input
                        type="text"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
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