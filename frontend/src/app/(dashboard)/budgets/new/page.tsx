"use client"

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import { CATEGORIES, Categories } from "@/app/types/categories";
import { BudgetRequest } from "@/app/types/budget";
import { TRANSACTIONEVENTS, TransactionEvents } from "@/app/types/transaction";
import { createBudget } from "@/app/lib/api/budgets";

export default function NewBudget() {
    const router = useRouter();
    const { user } = useUser();

    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [targetPeriod, setTargetPeriod] = useState<TransactionEvents>("MONTHLY");
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

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

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const requestData: BudgetRequest = {
            amount: parseFloat(amount),
            description,
            targetPeriod,
            isEnabled: true,
            category,
            userId: user!.id,
        };
        try {
            await createBudget(requestData, user.sessionUuid || "");

            setDescription("");
            setAmount("");
            setTargetPeriod("MONTHLY");
            setCategory("GROCERIES");

            router.push("/budgets");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to create budget.");
        }
    };

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-300">
                <h1 className="text-2xl font-bold text-gray-800">Create New Budget</h1>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label htmlFor="description" className="text-gray-700 mb-1 block">
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
                    <label htmlFor="amount" className="text-gray-700 mb-1 block">
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
                    <label htmlFor="targetPeriod" className="text-gray-700 mb-1 block">
                        Target Period:
                    </label>
                    <select
                        id="targetPeriod"
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
                    <label htmlFor="category" className="text-gray-700 mb-1 block">
                        Category:
                    </label>
                    <select
                        id="category"
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
                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-slate-600 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Save Budget
                    </button>
                </div>
            </form>
        </div>
    );
}