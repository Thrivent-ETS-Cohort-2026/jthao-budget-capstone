"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getAccounts } from "@/app/lib/api/accounts";
import { getBudgets } from "@/app/lib/api/budgets";
import { createTransaction } from "@/app/lib/api/transactions";
import { Account } from "@/app/types/account";
import { Budget } from "@/app/types/budget";
import { CreateTransactionRequest, TRANSACTIONEVENTS, TransactionEvents } from "@/app/types/transaction";
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
    const [category, setCategory] = useState<Categories | "">("");
    const [transactionOccurrence, setTransactionOccurrence] = useState<TransactionEvents | "">("");
    const [date, setDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        async function loadFormData() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const fetchedAccounts = await getAccounts(user.id, user.sessionUuid || "");
                const fetchedBudgets = await getBudgets(user.id, user.sessionUuid || "");

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
    }, [user?.id, user?.sessionUuid]);

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
            <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to add transactions.</p>
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
                <p className="text-gray-600 text-base">Loading form...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!description.trim() || !amount || accountId === "") {
            setErrorMessage("Description, amount, and account are required.");
            return;
        }
        if (category === "") {
            return;
        }
        if (transactionOccurrence === "") {
            return;
        }
        if (endDate !== "" && endDate < date) {
            setErrorMessage("End date cannot be before the transaction date.");
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
            endDate: endDate === "" ? null : endDate,
            budgetFrom: budgetFromValue,
        };

        try {
            await createTransaction(requestData, user.sessionUuid || "");
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
            setCategory("");
            setTransactionOccurrence("");
            setDate("");
            setEndDate("");

            router.push("/transactions");
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to create transaction.");
        }
    };

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl bg-white border border-orange-400">
            <div className="flex justify-between items-center p-6 border-b border-orange-300">
                <h1 className="text-2xl font-bold text-gray-800">Add New Transaction</h1>
            </div>
            {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label htmlFor="description" className="text-gray-700 ">
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
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
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
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
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
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
                    <label htmlFor="accountFrom" className="text-gray-700">
                        Account From
                    </label>
                    <input
                        id="accountFrom"
                        type="text"
                        value={accountFrom}
                        onChange={(e) => setAccountFrom(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        placeholder="e.g., Checking"
                    />
                </div>
                <div>
                    <label htmlFor="budget" className="text-gray-700">
                        Budget (Optional)
                    </label>
                    <select
                        id="budget"
                        value={budgetId}
                        onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
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
                    <label className="text-gray-700 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Categories | "")}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        required
                    >
                        <option value="">Select a Category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="transactionOccurrence" className="text-gray-700">
                        Transaction reoccurrence
                    </label>
                    <select
                        id="transactionOccurrence"
                        value={transactionOccurrence}
                        onChange={(e) => setTransactionOccurrence(e.target.value as TransactionEvents)}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        required
                    >
                        <option value="">Select a daily/weekly/monthly event</option>
                        {TRANSACTIONEVENTS.map((tEvents) => (
                            <option key={tEvents} value={tEvents}>
                                {tEvents}
                            </option>
                        ))}
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
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="text-gray-700">
                        End date
                        <span className="text-sm text-gray-500">(Optional)</span>
                    </label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        min={date}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Leave blank to create only the original transaction.
                    </p>
                </div>
                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/transactions")}
                        className="bg-orange-100 border border-orange-200 text-black p-2 rounded hover:bg-orange-200 hover:border-orange-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-orange-400 border border-orange-400 text-black p-2 rounded hover:bg-orange-500 hover:border-orange-600"
                    >
                        Save Transaction
                    </button>
                </div>
            </form>
        </div>
    );
}