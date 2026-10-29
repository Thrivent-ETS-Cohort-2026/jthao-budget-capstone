"use client";

import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Budget } from "@/app/types/budget";
import { Transaction } from "@/app/types/transaction";
import { getBudgets, deleteBudget } from "@/app/lib/api/budgets";
import { getTransactions } from "@/app/lib/api/transactions";
import Link from "next/link";
import { Categories } from "@/app/types/categories";
import { formatLocalDate, getBudgetPeriodSpending, isBudgetFullyUsed } from "@/app/lib/utils/budgetSpending";

export default function BudgetsPage() {
    const router = useRouter();
    const { user } = useUser();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [expandedBudgetIds, setExpandedBudgetIds] = useState<Set<number>>(
        () => new Set()
    );

    useEffect(() => {
        async function fetchData(): Promise<void> {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setErrorMessage("");
                setExpandedBudgetIds(new Set());

                const budgetList: Budget[] = await getBudgets(
                    user.id,
                    user.sessionUuid || ""
                );
                setBudgets(budgetList);

                const transactionList: Transaction[] =
                    await getTransactions(
                        user.id,
                        user.sessionUuid || ""
                    );
                setTransactions(transactionList);

                const d = new Date();
                const firstDay = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    1
                );

                const lastDay = new Date(
                    d.getFullYear(),
                    d.getMonth() + 1,
                    0
                );
                setStartDate(formatLocalDate(firstDay));
                setEndDate(formatLocalDate(lastDay));
            } catch (error: unknown) {
                console.error("Failed to fetch budget data:", error);
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to load budgets."
                );
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, user?.sessionUuid]);

    function calculateActualSpend(budgetId: number): number {
        const budget = budgets.find((b) => b.id === budgetId);

        if (
            !budget ||
            !startDate ||
            !endDate ||
            startDate > endDate
        ) {
            return 0;
        }

        const periods = getBudgetPeriodSpending(
            budget,
            transactions,
            startDate,
            endDate
        );
        return periods.reduce(
            (total, period) => total + period.actualSpend,
            0
        );
    }

    async function handleDelete(id: number): Promise<void> {
        if (!user) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setErrorMessage("");
            await deleteBudget(id, user.sessionUuid || "");
            setBudgets((prevBudgets: Budget[]) =>
                prevBudgets.filter((b: Budget) => b.id !== id)
            );
        } catch (error: unknown) {
            console.error("Error deleting budget:", error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to delete budget."
            );
        }
    }

    function toggleBudgetDetails(budgetId: number): void {
        setExpandedBudgetIds((previous) => {
            const next = new Set(previous);
            if (next.has(budgetId)) {
                next.delete(budgetId);
            } else {
                next.add(budgetId);
            }
            return next;
        });
    }

    function clearFilters(): void {
        const date = new Date();

        const firstDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );

        const lastDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        );

        setStartDate(formatLocalDate(firstDay));
        setEndDate(formatLocalDate(lastDay));
        setExpandedBudgetIds(new Set());
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-center">
                <p className="text-gray-600 mb-4">
                    Please log in to view budgets.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-orange-400 text-black p-2 rounded hover:bg-orange-500"
                >
                    Go to home page
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">
                    Loading budgets...
                </p>
            </div>
        );
    }

    const validDateRange =
        Boolean(startDate) &&
        Boolean(endDate) &&
        startDate <= endDate;

    const budgetAlerts: {
        category: Categories;
        periodLabel: string;
        percentage: number;
        isOverSpent: boolean;
        isWarning: boolean;
        isFullyUsed: boolean;
    }[] = budgets.flatMap((budget) => {
        if (!validDateRange) {
            return [];
        }

        const periods = getBudgetPeriodSpending(
            budget,
            transactions,
            startDate,
            endDate
        );

        return periods
            .map((period) => ({
                category: budget.category,
                periodLabel: period.label,
                percentage: period.percentage,
                isOverSpent: period.isOverSpent,
                isWarning: period.isWarning,
                isFullyUsed:
                    period.budgetAmount > 0 &&
                    isBudgetFullyUsed(
                        period.actualSpend,
                        period.budgetAmount
                    ),
            }))
            .filter(
                (period) =>
                    period.isOverSpent ||
                    period.isWarning ||
                    period.isFullyUsed
            );
    });

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Budgets vs Actual Spend
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/budgets/new")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-600"
                    >
                        Create Budget
                    </button>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">
                        {errorMessage}
                    </p>
                </div>
            )}
            {validDateRange && budgetAlerts.length > 0 && (
                <div className="mx-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-sm space-y-2">
                    <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                        Budget Threshold Alerts
                    </h2>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                        {budgetAlerts.map((alert, index) => (
                            <li
                                key={`${alert.category} -${alert.periodLabel} -${index} `}
                            >
                                <span className="font-semibold">
                                    {alert.category.replace(/_/g, " ")}
                                </span>
                                {" — "}
                                <span>{alert.periodLabel}</span>
                                {" is at "}
                                <span className="font-bold">
                                    {alert.percentage.toFixed(0)}%
                                </span>
                                {" of its limit! "}
                                {alert.isOverSpent
                                    ? "(Over Budget)"
                                    : alert.isFullyUsed
                                        ? "(Budget Fully Used)"
                                        : "(Approaching Limit)"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="border border-gray-300 p-4 rounded bg-white">
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                        <label className="text-xs text-gray-600 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1">
                            End Date
                        </label>
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
                        <h2 className="font-semibold text-gray-700">
                            Filter Budgets
                        </h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded text-xs">
                            {budgets.length} found
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-600"
                    >
                        Clear Filters
                    </button>
                </div>
                {!validDateRange && (
                    <p className="text-red-500 text-sm mb-3">
                        Please select a valid date range. The start date
                        must be on or before the end date.
                    </p>
                )}
                {budgets.length === 0 ? (
                    <p className="text-gray-400 text-center p-4">
                        No budgets found. Create one to start tracking!
                    </p>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                                    <th className="p-3 border-x border-gray-200">
                                        Description
                                    </th>
                                    <th className="p-3 border-x border-gray-200">
                                        Category
                                    </th>
                                    <th className="p-3 border-x border-gray-200">
                                        Budget Amount
                                    </th>
                                    <th className="p-3 border-x border-gray-200">
                                        Target Period
                                    </th>
                                    <th className="p-3 border-x border-gray-200">
                                        Actual Spend vs Filtered Budget
                                    </th>
                                    <th className="p-3 border-x border-gray-200">
                                        Status
                                    </th>
                                    <th className="p-3 border-x border-gray-200 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((budget) => {
                                    const periods = validDateRange
                                        ? getBudgetPeriodSpending(
                                            budget,
                                            transactions,
                                            startDate,
                                            endDate
                                        )
                                        : [];

                                    const actualSpend =
                                        calculateActualSpend(budget.id);

                                    const budgetLimit = Number(
                                        budget.amount
                                    );

                                    const totalBudgetAllowance =
                                        budgetLimit * periods.length;

                                    const percentage =
                                        totalBudgetAllowance > 0
                                            ? (actualSpend /
                                                totalBudgetAllowance) *
                                            100
                                            : 0;

                                    const isOverSpent =
                                        totalBudgetAllowance > 0 &&
                                        percentage > 100;

                                    const isFullyUsed =
                                        totalBudgetAllowance > 0 &&
                                        isBudgetFullyUsed(
                                            actualSpend,
                                            totalBudgetAllowance
                                        );

                                    const isWarning =
                                        percentage >= 75 &&
                                        percentage < 100;

                                    return (
                                        <Fragment key={budget.id}>
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-800">
                                                    {budget.description || "—"}
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    {budget.category}
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    ${budgetLimit.toFixed(2)}
                                                </td>
                                                <td className="p-3 text-gray-700 capitalize">
                                                    {budget.targetPeriod.toLowerCase()}
                                                </td>

                                                <td className="p-3 font-semibold">
                                                    <div>
                                                        <p>${actualSpend.toFixed(2)}</p>
                                                        <p className="text-xs font-normal text-gray-600">
                                                            of ${totalBudgetAllowance.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="p-3">
                                                    {isOverSpent ? (
                                                        <span className="bg-red-100 text-red-700 p-1 rounded text-xs font-bold">
                                                            Over Budget (
                                                            {percentage.toFixed(0)}%)
                                                        </span>
                                                    ) : isFullyUsed ? (
                                                        <span className="bg-orange-100 text-orange-700 p-1 rounded text-xs font-bold">
                                                            Budget Fully Used (100%)
                                                        </span>
                                                    ) : isWarning ? (
                                                        <span className="bg-yellow-100 text-yellow-800 p-1 rounded text-xs font-bold">
                                                            Approaching Limit (
                                                            {percentage.toFixed(0)}%)
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-100 text-green-700 p-1 rounded text-xs font-semibold">
                                                            On Track (
                                                            {percentage.toFixed(0)}%)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            toggleBudgetDetails(
                                                                budget.id
                                                            )
                                                        }
                                                        disabled={!validDateRange}
                                                        aria-expanded={expandedBudgetIds.has(
                                                            budget.id
                                                        )}
                                                        className="p-1 text-black bg-slate-300 border border-slate-500 rounded hover:bg-slate-500 hover:text-white text-xs"
                                                    >
                                                        {expandedBudgetIds.has(
                                                            budget.id
                                                        )
                                                            ? "Hide Details ▲"
                                                            : "Show Details ▼"}
                                                    </button>
                                                    <Link
                                                        href={`/budgets/${budget.id}/update`}
                                                        className="p-1 text-black bg-slate-300 border border-slate-500 rounded hover:bg-slate-500 hover:text-white text-xs"
                                                    >
                                                        Edit
                                                    </Link >
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                budget.id
                                                            )
                                                        }
                                                        className="p-1 text-black bg-slate-300 border border-slate-500 rounded hover:bg-slate-500 hover:text-white text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </td >
                                            </tr >

                                            {
                                                expandedBudgetIds.has(budget.id) && (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="p-3 bg-slate-100"
                                                        >
                                                            <div className="max-h-40 overflow-y-auto border border-slate-300 rounded bg-white px-3">
                                                                {periods.length === 0 ? (
                                                                    <p className="py-3 text-sm text-gray-500">
                                                                        No periods available for this date range.
                                                                    </p>
                                                                ) : (
                                                                    periods.map((period) => {
                                                                        const isFullyUsed =
                                                                            period.budgetAmount > 0 &&
                                                                            isBudgetFullyUsed(
                                                                                period.actualSpend,
                                                                                period.budgetAmount
                                                                            );

                                                                        return (
                                                                            <div
                                                                                key={period.key}
                                                                                className="flex justify-between items-center gap-3 border-b border-slate-300 py-2 last:border-b-0"
                                                                            >
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-800">
                                                                                        {period.label}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        Budget: $
                                                                                        {period.budgetAmount.toFixed(2)}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="text-sm font-semibold text-gray-800">
                                                                                        ${period.actualSpend.toFixed(2)}
                                                                                    </p>
                                                                                    <p
                                                                                        className={`text-xs font-semibold ${period.isOverSpent
                                                                                            ? "text-red-600"
                                                                                            : isFullyUsed
                                                                                                ? "text-orange-600"
                                                                                                : period.isWarning
                                                                                                    ? "text-yellow-600"
                                                                                                    : "text-green-600"
                                                                                            }`}
                                                                                    >
                                                                                        {period.isOverSpent
                                                                                            ? `${period.percentage.toFixed(0)}% — Over Budget`
                                                                                            : isFullyUsed
                                                                                                ? "100% — Budget Fully Used"
                                                                                                : period.isWarning
                                                                                                    ? `${period.percentage.toFixed(0)}% — Approaching Limit`
                                                                                                    : `${period.percentage.toFixed(0)}% used`}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </Fragment >
                                    );
                                })}
                            </tbody >
                        </table >
                    </div >
                )}
            </div >
        </div >
    );
}