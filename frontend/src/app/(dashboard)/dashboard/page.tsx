"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import EmptyStateDashboard from "@/app/components/EmptyStateDashboard";
import { Account } from "@/app/types/account";
import { Budget } from "@/app/types/budget";
import { Transaction } from "@/app/types/transaction";
import { getAccounts } from "@/app/lib/api/accounts";
import { getBudgets } from "@/app/lib/api/budgets";
import { getTransactions } from "@/app/lib/api/transactions";

export default function Dashboard() {
    const router = useRouter();
    const { user } = useUser();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const accountRes = await getAccounts(user.id);
                setAccounts(accountRes);

                const budgetRes = await getBudgets(user.id);
                setBudgets(budgetRes);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading dashboard...</p>
            </div>
        );
    }

    // if (!user) {
    //     return (
    //         <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
    //             <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
    //             <button
    //                 onClick={() => router.push("/")}
    //                 className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    //             >
    //                 Go to home page
    //             </button>
    //         </div>
    //     );
    // }

    // if (accounts.length === 0) {
    //     return (
    //         <div className="mx-auto m-5">
    //             <EmptyStateDashboard onCreateAccount={() => router.push("/account/new")} />
    //         </div>
    //     );
    // }

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-gray-800 px-5">Financial Dashboard</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/account/new")}
                        className="bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700"
                    >
                        Add Account
                    </button>
                    <button
                        onClick={() => router.push("/budgets/new")}
                        className="bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700"
                    >
                        Add Budget
                    </button>
                    <button
                        onClick={() => router.push("/transactions")}
                        className="bg-indigo-600 text-white p-2 rounded text-sm hover:bg-indigo-700"
                    >
                        View Transactions
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-300 p-4 rounded">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <h2 className="font-semibold text-gray-700">Accounts</h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded">
                            {accounts.length}
                        </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                        {accounts.map((account) => (
                            <li key={account.id} className="flex justify-between">
                                <span>{account.accountName}</span>
                                <span className="text-gray-400">({account.accountType})</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border border-gray-300 p-4 rounded">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <h2 className="font-semibold text-gray-700">Budgets</h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded">
                            {budgets.length}
                        </span>
                    </div>
                    {budgets.length === 0 ? (
                        <p className="text-sm text-gray-400">No budgets created yet.</p>
                    ) : (
                        <ul className="space-y-2 text-sm text-gray-600">
                            {budgets.map((budget) => (
                                <li key={budget.id} className="flex justify-between">
                                    <span>{budget.category}</span>
                                    <span>${budget.amount}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}