"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { BudgetRequest } from "@/app/types/budget";
import { getBudget, createBudget } from "@/app/lib/api/budgets";
import { CATEGORIES, Categories } from "@/app/types/categories";
import { TRANSACTIONEVENTS, TransactionEvents } from "@/app/types/transaction";

function UpdateBudgetForm() {
    const router = useRouter();
    const params = useParams();
    const budgetId: number = Number(params.budgetId);
    const { user } = useUser();

    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [targetPeriod, setTargetPeriod] = useState<TransactionEvents>("ONCE");
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [isEnabled, setIsEnabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            if (!user?.id || !budgetId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const budgetResp = await getBudget(budgetId);

                setDescription(budgetResp.description);
                setAmount(budgetResp.amount.toString());
                setTargetPeriod(budgetResp.targetPeriod);
                setCategory(budgetResp.category);
                setIsEnabled(budgetResp.isEnabled ?? true);
            } catch (error) {
                console.error("Failed to fetch budget data:", error);
                setErrorMessage((error as Error).message || "Failed to load budget data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, budgetId]);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to create a budget.</p>
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
                <p className="text-gray-600 text-base">Loading budget...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const requestData: BudgetRequest = {
            amount: parseFloat(amount),
            description,
            targetPeriod,
            isEnabled,
            category,
            userId: user.id,
        };

        try {
            await createBudget(requestData);
            router.push("/budgets");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to update budget.");
        }
    };

    return (
        <div className="mx-auto p-6 mt-10 border border-gray-300 rounded max-w-xl">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Create Budget</h1>
            {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="description" className="text-gray-700">
                        Description:
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Monthly Groceries"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="text-gray-700">
                        Amount ($)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="45.50"
                        required
                    />
                </div>
                <div>
                    <label className="text-gray-700 mb-1">Target Period:</label>
                    <select
                        value={targetPeriod}
                        onChange={(e) => setTargetPeriod(e.target.value as TransactionEvents)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Target Period</option>
                        {TRANSACTIONEVENTS.map((tEvents) => (
                            <option key={tEvents} value={tEvents}>
                                {tEvents}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Categories)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((categories) => (
                            <option key={categories} value={categories}>
                                {categories.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => router.push("/budgets")}
                        className="bg-gray-600 text-white p-2 m-2 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 m-2 rounded hover:bg-blue-700"
                    >
                        Save Budget
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function UpdateBudgetPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading...</p>
            </div>
        }>
            <UpdateBudgetForm />
        </Suspense>
    );
}