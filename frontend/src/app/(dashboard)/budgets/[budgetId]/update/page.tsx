"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Budget, BudgetRequest } from "@/app/types/budget";
import { getBudget, updateBudget } from "@/app/lib/api/budgets";
import { CATEGORIES, Categories } from "@/app/types/categories";
import { TRANSACTIONEVENTS, TransactionEvents } from "@/app/types/transaction";

function UpdateBudgetForm() {
    const router = useRouter();
    const params = useParams();
    const budgetId: number = Number(params.budgetId);
    const { user } = useUser();

    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [amount, setAmount] = useState<string>("");
    const [targetPeriod, setTargetPeriod] = useState<TransactionEvents>("MONTHLY");
    const [description, setDescription] = useState<string>("");
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
                const budgetResp: Budget = await getBudget(budgetId);

                setCategory(budgetResp.category as Categories);
                setAmount(budgetResp.amount.toString());
                setTargetPeriod(budgetResp.targetPeriod || "MONTHLY");
                setDescription(budgetResp.description || "");
            } catch (error) {
                console.error("Failed to fetch budget data:", error);
                setErrorMessage((error as Error).message || "Failed to load budget data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, budgetId]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const requestData: BudgetRequest = {
            amount: parseFloat(amount),
            description,
            targetPeriod: targetPeriod,
            isEnabled: true,
            category,
            userId: user!.id,
        };

        try {
            await updateBudget(budgetId, requestData);
            router.push("/budgets");
        } catch (error) {
            console.error("Error updating budget:", error);
            setErrorMessage((error as Error).message || "Failed to update budget.");
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to update a budget.</p>
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

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl">
            <div className="flex justify-content items-center p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Edit Budget</h1>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label className="text-gray-700 mb-1 block">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Monthly Groceries"
                    />
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
                <div>
                    <label className="text-gray-700 mb-1 block">Budget Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
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
                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/budgets")}
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