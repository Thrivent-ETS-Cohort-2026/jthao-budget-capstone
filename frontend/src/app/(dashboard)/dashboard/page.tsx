"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import EmptyStateDashboard from "@/app/components/EmptyStateDashboard";
import { Account } from "@/app/types/account";
import { Budget } from "@/app/types/budget";
import { getAccounts, deleteAccount } from "@/app/lib/api/accounts";
import { getBudgets } from "@/app/lib/api/budgets";

export default function Dashboard() {
    const router = useRouter();
    const { user } = useUser();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);

                const accountRes = await getAccounts(user.id, user.sessionUuid || "");
                setAccounts(accountRes);

                const budgetRes = await getBudgets(user.id, user.sessionUuid || "");
                setBudgets(budgetRes);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, [user?.id, user?.sessionUuid]);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Go to home page
                </button>
            </div>
        );
    }

    const handleDeleteAccount = async (id: number) => {
        if (!confirm("Are you sure you want to delete this account?")) {
            return;
        }

        setErrorMessage("");

        try {
            await deleteAccount(id, user.sessionUuid || "");
            setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
        } catch (error) {
            console.error("Error deleting account:", error);
            setErrorMessage((error as Error).message || "Failed to delete account.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading dashboard...</p>
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="mx-auto m-5">
                <EmptyStateDashboard onCreateAccount={() => router.push("/account/new")} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/report")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        View Reports
                    </button>
                    <button
                        onClick={() => router.push("/account/new")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Add Account
                    </button>
                    <button
                        onClick={() => router.push("/budgets/new")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Add Budget
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div>
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-300 p-4 rounded bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <h2 className="font-semibold text-gray-700">Accounts</h2>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                            {accounts.length}
                        </span>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                        {accounts.map((account) => (
                            <li key={account.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                <div>
                                    <span className="font-medium text-gray-800">{account.accountName}</span>{" "}
                                    <span className="text-gray-400 text-xs">({account.accountType})</span>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => router.push(`/account/${account.id}/update`)}
                                        className="bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAccount(account.id)}
                                        className="bg-red-600 text-white text-xs px-2.5 py-1.5 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-gray-300 p-4 rounded bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <div className="flex items-center space-x-3">
                            <h2 className="font-semibold text-gray-700">Budgets</h2>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                            {budgets.length}
                        </span>
                    </div>
                    {budgets.length === 0 ? (
                        <p className="text-sm text-gray-400">No budgets created yet.</p>
                    ) : (
                        <ul className="space-y-3 text-sm text-gray-600">
                            {budgets.map((budget) => (
                                <li key={budget.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                    <span className="font-medium text-gray-800">{budget.category}</span>
                                    <span className="text-gray-700 font-semibold">${budget.amount}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}