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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [accountFilter, setAccountFilter] = useState<string>("ALL");
    const itemsPerPage = 10;

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

                const transactionRes = await getTransactions(user.id);
                setTransactions(transactionRes);

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

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Go to Login
                </button>
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
    const filteredTransactions = transactions
        .filter((transaction) => {
            if (startDate && transaction.date < startDate) return false;
            if (endDate && transaction.date > endDate) return false;
            if (
                categoryFilter.trim() &&
                !transaction.category.toLowerCase().includes(categoryFilter.toLowerCase())
            ) {
                return false;
            }
            if (accountFilter !== "ALL" && transaction.accountFrom !== accountFilter) {
                return false;
            }
            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
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
                        onClick={() => router.push("/transactions/new")}
                        className="bg-gray-600 text-white p-2 rounded text-sm hover:bg-gray-700"
                    >
                        Log Transaction
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
                        {accounts.map((acc) => (
                            <li key={acc.id} className="flex justify-between">
                                <span>{acc.accountName}</span>
                                <span className="text-gray-400">({acc.accountType})</span>
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
                            {budgets.map((bud) => (
                                <li key={bud.id} className="flex justify-between">
                                    <span>{bud.category}</span>
                                    <span>${bud.amount}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="border border-gray-300 p-4 rounded">
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-700">Transactions</h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded">
                            {filteredTransactions.length}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-5">
                    <div>
                        <label className="text-gray-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-gray-600 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-gray-600 mb-1">Category</label>
                        <input
                            type="text"
                            placeholder="Filter category..."
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-gray-600 mb-1">Account</label>
                        <select
                            value={accountFilter}
                            onChange={(e) => {
                                setAccountFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300 rounded"
                        >
                            <option value="ALL">All Accounts</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.accountName}>
                                    {acc.accountName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {currentTransactions.length === 0 ? (
                    <p className="text-gray-400 text-center p-2">No transactions found.</p>
                ) : (
                    <div>
                        <div className="border border-gray-200 rounded-lg">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 ">
                                        <th className="p-3 border-x border-gray-200">Date</th>
                                        <th className="p-3 border-x border-gray-200">Description</th>
                                        <th className="p-3 border-x border-gray-200">Amount</th>
                                        <th className="p-3 border-x border-gray-200">Account From</th>
                                        <th className="p-3 border-x border-gray-200">Budget From</th>
                                        <th className="p-3 border-x border-gray-200">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-gray-200">
                                            <td className="p-2 text-sm text-gray-700">
                                                {tx.date}
                                            </td>
                                            <td className="p-2 text-gray-700">
                                                {tx.description}
                                            </td>
                                            <td className="p-2 text-gray-700">
                                                ${tx.amount.toFixed(2)}
                                            </td>
                                            <td className="p-2 text-gray-700">
                                                {tx.accountFrom}
                                            </td>
                                            <td className="p-2 text-gray-700">
                                                {tx.budgetFrom ? tx.budgetFrom : ""}
                                            </td>

                                            <td>
                                                <span className="bg-gray-100 text-gray-800 p-1 rounded">
                                                    {tx.category || "Uncategorized"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}