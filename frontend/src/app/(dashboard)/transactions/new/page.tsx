"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getAccounts } from "@/app/lib/api/accounts";
import { getBudgets } from "@/app/lib/api/budgets";
import { createTransaction } from "@/app/lib/api/transactions";
import { Account } from "@/app/types/account";
import { Budget } from "@/app/types/budget";
import { CreateTransactionRequest, TransactionEvents } from "@/app/types/transaction";
import { CATEGORIES, Categories } from "@/app/types/categories"

export default function NewTransaction() {
    const router = useRouter();
    const { user } = useUser();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [accountId, setAccountId] = useState<number | "">("");
    const [budgetId, setBudgetId] = useState<number | "">("");
    const [accountFrom, setAccountFrom] = useState<string>("");
    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [transactionOccurrence, setTransactionOccurrence] = useState<TransactionEvents>("ONCE");
    const [date, setDate] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        async function loadFormData() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const fetchedAccounts = await getAccounts(user.id);
                const fetchedBudgets = await getBudgets(user.id);

                setAccounts(fetchedAccounts);
                setBudgets(fetchedBudgets);

                setDate(new Date().toISOString().split("T")[0]);

                if (fetchedAccounts.length > 0) {
                    setAccountId(fetchedAccounts[0].id);
                    setAccountFrom(fetchedAccounts[0].accountName);
                }
            } catch (error) {
                console.error("Failed to load form data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadFormData();
    }, [user?.id]);

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value ? Number(e.target.value) : "";
        setAccountId(selectedId);

        const foundAccount = accounts.find((acc) => acc.id === selectedId);
        if (foundAccount) {
            setAccountFrom(foundAccount.accountName);
        } else {
            setAccountFrom("");
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to add transactions.</p>
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
                <p className="text-gray-600 text-base">Loading form...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!description.trim() || !amount || accountId === "") {
            setErrorMessage("Description, amount, and account are required.");
            return;
        }
        let budgetFromValue: string | null = null;
        if (budgetId !== "") {
            const selectedBudget = budgets.find((b) => b.id === Number(budgetId));
            if (selectedBudget) {
                budgetFromValue = selectedBudget.description;
            }
        }

        const requestData: CreateTransactionRequest = {
            description,
            amount: parseFloat(amount),
            accountId: Number(accountId),
            budgetId: budgetId === "" ? null : Number(budgetId),
            userId: user!.id,
            accountFrom,
            category,
            transactionOccurrence,
            date,
            budgetFrom: budgetFromValue,
        };

        try {
            await createTransaction(requestData);

            setDescription("");
            setAmount("");
            setBudgetId("");
            setErrorMessage("");
            setAccountFrom("");
            setAccountId("");
            setAccounts([]);
            setBudgets([]);
            setAccountId("");
            setBudgetId("");
            setCategory("GROCERIES");
            setTransactionOccurrence("ONCE");
            setDate("");

            router.push("/transactions");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to create transaction.");
        }
    };

    return (
        <div className="mx-auto p-5 mt-10 border border-gray-300 rounded">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Add New Transaction</h1>

            {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="description" className="text-gray-700 ">
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Grocery Store"
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
                    <label htmlFor="account" className="text-gray-700">
                        Account
                    </label>
                    <select
                        id="account"
                        value={accountId}
                        onChange={handleAccountChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.accountName} ({account.accountType})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="budget" className="text-gray-700">
                        Budget (Optional)
                    </label>
                    <select
                        id="budget"
                        value={budgetId}
                        onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">None (Unbudgeted)</option>
                        {budgets.map((bud) => (
                            <option key={bud.id} value={bud.id}>
                                {bud.category} (${bud.amount})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="accountFrom" className="text-gray-700">
                        Account From
                    </label>
                    <input
                        id="accountFrom"
                        type="text"
                        value={accountFrom}
                        onChange={(e) => setAccountFrom(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Checking"
                    />
                </div>
                <div>
                    <label className="text-gray-700 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Categories)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="transactionOccurrence" className="text-gray-700">
                        Reoccurrence
                    </label>
                    <select
                        id="transactionOccurrence"
                        value={transactionOccurrence}
                        onChange={(e) => setTransactionOccurrence(e.target.value as TransactionEvents)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="ONCE">Once</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="text-gray-700">
                        Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 m-2 rounded hover:bg-blue-700"
                >
                    Save Transaction
                </button>
                <button
                    onClick={() => router.push("/transactions")}
                    className="bg-gray-600 text-white p-2 m-2 rounded hover:bg-gray-700"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}