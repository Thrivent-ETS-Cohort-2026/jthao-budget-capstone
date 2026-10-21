"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Budget } from "@/app/types/budget";
import { Transaction } from "@/app/types/transaction";
import { getBudgets, deleteBudget } from "@/app/lib/api/budgets";
import { getTransactions } from "@/app/lib/api/transactions";
import Link from "next/link";
import { Categories } from "@/app/types/categories";
import { getProjectedDates } from "@/app/lib/utils/recurring";

export default function BudgetsPage() {
    const router = useRouter();
    const { user } = useUser();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        async function fetchData(): Promise<void> {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setErrorMessage("");

                const budgetList: Budget[] = await getBudgets(user.id, user.sessionUuid || "");
                setBudgets(budgetList);

                const transactionList: Transaction[] = await getTransactions(user.id, user.sessionUuid || "");
                setTransactions(transactionList);

                const d: Date = new Date();
                const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
                const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
                setStartDate(firstDay);
                setEndDate(lastDay);
            } catch (error) {
                console.error("Failed to fetch budget data:", error);
                setErrorMessage((error as Error).message || "Failed to load budgets.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, user?.sessionUuid]);

    function calculateActualSpend(budgetId: number): number {
        const start: Date = new Date(startDate);
        const end: Date = new Date(endDate);
        let totalSpend = 0;

        for (const transaction of transactions) {
            if (transaction.deletedAt || transaction.budgetId !== budgetId) {
                continue;
            }

            const transactionDate: Date = new Date(transaction.date);
            const amount: number = Number(transaction.amount);

            if (transactionDate >= start && transactionDate <= end) {
                totalSpend += amount;
            }

            const projectedDates = getProjectedDates(transaction, 24);
            projectedDates.forEach((dateStr) => {
                const pDate = new Date(dateStr);
                if (pDate >= start && pDate <= end) {
                    totalSpend += amount;
                }
            });
        }
        return totalSpend;
    }

    async function handleDelete(id: number): Promise<void> {
        if (!user) {
            return
        }
        const confirmed = window.confirm("Are you sure you want to delete this budget?");
        if (!confirmed) {
            return;
        }
        try {
            setErrorMessage("");
            await deleteBudget(id, user.sessionUuid || "");
            setBudgets((prevBudgets: Budget[]) => prevBudgets.filter((b: Budget) => b.id !== id));
        } catch (error: unknown) {
            console.error("Error deleting budget:", error);
            setErrorMessage((error as Error).message || "Failed to delete budget.");
        }
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to view budgets.</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Go to home page
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading budgets...</p>
            </div>
        );
    }

    const budgetAlerts: {
        category: Categories;
        percentage: number;
        isOverspent: boolean;
        isWarning: boolean;
    }[] = budgets.map((budget) => {
        const actualSpend = calculateActualSpend(budget.id);
        const budgetLimit = Number(budget.amount);
        const percentage = budgetLimit > 0 ? (actualSpend / budgetLimit) * 100 : 0;
        return {
            category: budget.category,
            percentage,
            isOverspent: percentage >= 100,
            isWarning: percentage >= 75 && percentage < 100,
        };
    }).filter(item => item.isOverspent || item.isWarning);

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-gray-800">Budgets vs Actual Spend</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/budgets/new")}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Create Budget
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            {budgetAlerts.length > 0 && (
                <div className="mx-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-sm space-y-2">
                    <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide">Budget Threshold Alerts</h2>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                        {budgetAlerts.map((alert, idx) => (
                            <li key={idx}>
                                <span className="font-semibold">{alert.category.replace(/_/g, " ")}</span> is at{" "}
                                <span className="font-bold">{alert.percentage.toFixed(0)}%</span> of its limit!{" "}
                                {alert.isOverspent ? "(Budget Exceeded)" : "(Approaching Limit)"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border border-gray-300 p-4 rounded">
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                        <label className="text-xs text-gray-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-700">Filter Budgets</h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded text-xs">
                            {budgets.length} found
                        </span>
                    </div>
                </div>

                {budgets.length === 0 ? (
                    <p className="text-gray-400 text-center p-4">No budgets found. Create one to start tracking!</p>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                                    <th className="p-3 border-x border-gray-200">Description</th>
                                    <th className="p-3 border-x border-gray-200">Category</th>
                                    <th className="p-3 border-x border-gray-200">Budget Amount</th>
                                    <th className="p-3 border-x border-gray-200">Target Period</th>
                                    <th className="p-3 border-x border-gray-200">Actual Spend</th>
                                    <th className="p-3 border-x border-gray-200">Status</th>
                                    <th className="p-3 border-x border-gray-200 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((budget) => {
                                    const actualSpend = calculateActualSpend(budget.id);
                                    const budgetLimit: number = Number(budget.amount);
                                    const percentage: number = budgetLimit > 0 ? (actualSpend / budgetLimit) * 100 : 0;

                                    const isOverspent: boolean = percentage >= 100;
                                    const isWarning: boolean = percentage >= 75 && percentage < 100;

                                    return (
                                        <tr key={budget.id} className="border-b border-gray-200">
                                            <td className="p-3 font-medium text-gray-800">{budget.description || "—"}</td>
                                            <td className="p-3 text-gray-700">{budget.category}</td>
                                            <td className="p-3 text-gray-700">${budgetLimit.toFixed(2)}</td>
                                            <td className="p-3 text-gray-700 capitalize">{budget.targetPeriod}</td>
                                            <td className={`p-3 font-semibold ${isOverspent ? "text-red-600" : isWarning ? "text-yellow-600" : "text-gray-700"}`}>
                                                ${actualSpend.toFixed(2)}
                                            </td>
                                            <td className="p-3">
                                                {isOverspent ? (
                                                    <span className="bg-red-100 text-red-700 p-1 rounded text-xs font-bold">
                                                        Overspent ({percentage.toFixed(0)}%)
                                                    </span>
                                                ) : isWarning ? (
                                                    <span className="bg-yellow-100 text-yellow-800 p-1 rounded text-xs font-bold">
                                                        Warning ({percentage.toFixed(0)}%)
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-700 p-1 rounded text-xs font-semibold">
                                                        On Track ({percentage.toFixed(0)}%)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <Link
                                                    href={`/budgets/${budget.id}/update`}
                                                    className="p-1 text-black bg-gray-200 border border-gray-500 rounded  hover:bg-gray-400 text-xs"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(budget.id)}
                                                    className="p-1 text-black bg-gray-200 border border-gray-500 rounded  hover:bg-gray-400 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}