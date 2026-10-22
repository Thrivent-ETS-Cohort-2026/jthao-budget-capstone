"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Budget } from "@/app/types/budget";
import { Transaction } from "@/app/types/transaction";
import { getBudgets } from "@/app/lib/api/budgets";
import { getTransactions } from "@/app/lib/api/transactions";
import { Categories } from "@/app/types/categories";
import { getProjectedDates } from "@/app/lib/utils/recurring";

export default function ReportsPage() {
    const router = useRouter();
    const { user } = useUser();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

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
            } catch (error) {
                console.error("Failed to fetch report data:", error);
                setErrorMessage((error as Error).message || "Failed to load reporting data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, user?.sessionUuid]);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to view reports.</p>
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
                <p className="text-gray-600 text-base">Loading reports...</p>
            </div>
        );
    }

    const totalBudgetAllocation: number = budgets.reduce((account: number, budget: Budget) => account + Number(budget.amount), 0);

    const categorySpendMap: { [category: string]: number } = {};
    const monthlySpendMap: { [yearMonth: string]: number } = {};

    transactions.forEach((transaction: Transaction) => {
        if (transaction.deletedAt) return;
        const amount: number = Number(transaction.amount);

        const matchedBudget: Budget | undefined = budgets.find((budget: Budget) => budget.id === transaction.budgetId);
        const category: Categories = matchedBudget?.category || transaction.category;

        // Base transaction spend
        categorySpendMap[category] = (categorySpendMap[category] || 0) + amount;
        const yearMonth: string = transaction.date.substring(0, 7);
        monthlySpendMap[yearMonth] = (monthlySpendMap[yearMonth] || 0) + amount;

        // Projected recurring future occurrences (12 months forward rolling window)
        const projectedDates: string[] = getProjectedDates(transaction, 12);
        projectedDates.forEach((dateStr: string) => {
            categorySpendMap[category] = (categorySpendMap[category] || 0) + amount;
            const yearMonth: string = dateStr.substring(0, 7);
            monthlySpendMap[yearMonth] = (monthlySpendMap[yearMonth] || 0) + amount;
        });
    });

    const topCategories = Object.entries(categorySpendMap)
        .sort(([, x], [, y]) => y - x)
        .slice(0, 5);

    const sortedMonths = Object.entries(monthlySpendMap)
        .sort(([x], [y]) => x.localeCompare(y));

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-gray-800">Financial Reports & Analytics</h1>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-gray-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                >
                    Back to Dashboard
                </button>
            </div>

            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-300 p-5 rounded bg-white shadow-sm">
                    <h2 className="text-sm font-bold text-black uppercase tracking-wide">Total Active Budgets</h2>
                    <p className="text-2xl font-bold text-gray-800 mt-1">${totalBudgetAllocation.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{budgets.length} budget categories configured</p>
                </div>
                <div className="border border-gray-300 p-5 rounded bg-white shadow-sm">
                    <h2 className="text-sm font-bold text-black uppercase tracking-wide">Active Transactions Tracked</h2>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {transactions.filter(trans => !trans.deletedAt).length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Across all linked accounts</p>
                </div>
            </div>

            {/* Top 5 Spending Categories */}
            <div className="border border-gray-300 p-5 rounded bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Top 5 Spending Categories</h2>
                {topCategories.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No spending data available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
                                    <th className="p-3">Rank</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3 text-right">Total Spend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCategories.map(([category, amount], index) => (
                                    <tr key={category} className="border-b border-gray-100">
                                        <td className="p-3">
                                            {index === 0 ? (
                                                <span className="bg-blue-100 text-blue-800 p-2 rounded text-xs font-bold">#1</span>
                                            ) : index === 1 ? (
                                                <span className="bg-emerald-100 text-emerald-800 p-2 rounded text-xs font-bold">#2</span>
                                            ) : index === 2 ? (
                                                <span className="bg-amber-100 text-amber-800 p-2 rounded text-xs font-bold">#3</span>
                                            ) : (
                                                <span className="text-gray-500 p-2 text-xs font-semibold">#{index + 1}</span>
                                            )}
                                        </td>
                                        <td className="p-3 font-medium text-gray-800">{category.replace(/_/g, " ")}</td>
                                        <td className="p-3 text-right font-semibold text-gray-700">${amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Month-by-Month Spending */}
            <div className="border border-gray-300 p-5 rounded bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Month-by-Month Spending (12-Month Forecast)</h2>
                {sortedMonths.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No monthly data available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
                                    <th className="p-3">Month</th>
                                    <th className="p-3 text-right">Total Spend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMonths.map(([yearMonth, amount]) => (
                                    <tr key={yearMonth} className="border-b border-gray-100">
                                        <td className="p-3 font-medium text-gray-800">{yearMonth}</td>
                                        <td className="p-3 text-right font-semibold text-gray-700">${amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}