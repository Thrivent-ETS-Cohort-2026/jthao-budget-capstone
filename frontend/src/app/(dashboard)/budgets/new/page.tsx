"use client"


import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import { Categories } from "@/app/types/categories";
import { CreateBudgetRequest } from "@/app/types/budget";
import { TRANSACTIONEVENTS, TransactionEvents } from "@/app/types/transaction";
import { createBudget } from "@/app/lib/api/budgets";

export default function NewBudget() {
    const router = useRouter();
    const { user } = useUser();

    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [targetPeriod, setTargetPeriod] = useState<TransactionEvents>("ONCE");
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

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const requestData: CreateBudgetRequest = {
            amount: parseFloat(amount),
            description,
            targetPeriod,
            isEnabled: true,
            category,
            userId: user!.id,
        };
        try {
            await createBudget(requestData);
            router.push("/dashboard");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to create account.");
        }
    };

    return (
        <>
            <div className=" mx-auto p-6 mt-10 border border-gray-300 rounded">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Create New Budget</h1>
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
                        <label htmlFor="category" className="text-gray-700">
                            Target Period:
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Categories)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="HOUSING">Housing</option>
                            <option value="GROCERIES">Groceries</option>
                            <option value="TRANSPORTATION">Transportation</option>
                            <option value="ENTERTAINMENT">Entertainment</option>
                            <option value="UTILITIES">Utilities</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="PERSONAL_CARE">Personal Care</option>
                            <option value="EDUCATION">Education</option>
                            <option value="GIFT_GIVING">Gift shopping</option>
                            <option value="SHOPPING">Shopping</option>
                            <option value="SAVINGS_INVESTMENTS">Savings Investments</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 m-2 rounded hover:bg-blue-700"
                    >
                        Save Budget
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-600 text-white p-2 m-2 rounded hover:bg-gray-700"
                    >
                        Back to the Dashboard
                    </button>
                </form>
            </div>
        </>
    );
}