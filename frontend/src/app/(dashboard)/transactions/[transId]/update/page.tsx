"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Account } from "@/app/types/account";
import { Budget } from "@/app/types/budget";
import { getAccounts } from "@/app/lib/api/accounts";
import { getBudgets } from "@/app/lib/api/budgets";
import { getTransaction, updateTransaction } from "@/app/lib/api/transactions";
import { Transaction, TransactionEvents, UpdateTransactionRequest, TRANSACTIONEVENTS } from "@/app/types/transaction";
import { CATEGORIES, Categories } from "@/app/types/categories";

function UpdateTransactionForm() {
    const router = useRouter();
    const params = useParams();
    const transactionId: number = Number(params.transId);
    const { user } = useUser();

    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [category, setCategory] = useState<Categories>("GROCERIES");
    const [transactionOccurrence, setTransactionOccurrence] = useState<TransactionEvents>("ONCE");
    const [accountId, setAccountId] = useState<number | "">("");
    const [accountFrom, setAccountFrom] = useState<string>("");
    const [budgetId, setBudgetId] = useState<number | "">("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            if (!user?.id || !transactionId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setErrorMessage("");

                const accountRes: Account[] = await getAccounts(user.id, user.sessionUuid || "");
                setAccounts(accountRes);

                const budgetRes: Budget[] = await getBudgets(user.id, user.sessionUuid || "");
                setBudgets(budgetRes);

                const transactionResp: Transaction = await getTransaction(transactionId, user.sessionUuid || "");

                setDescription(transactionResp.description);
                setAmount(transactionResp.amount.toString());
                setDate(transactionResp.date);
                setEndDate(transactionResp.endDate ?? "");
                setCategory(transactionResp.category);
                setTransactionOccurrence(transactionResp.transactionOccurrence);
                setAccountId(transactionResp.accountId);
                setAccountFrom(transactionResp.accountFrom);
                setBudgetId(transactionResp.budgetId ?? "");
            } catch (error) {
                console.error("Failed to fetch update data:", error);
                setErrorMessage((error as Error).message || "Failed to load transaction data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, user?.sessionUuid, transactionId]);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to update a transaction.</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Go to home page
                </button>
            </div>
        );
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value ? Number(e.target.value) : "";
        setAccountId(selectedId);
        const found = accounts.find((acc) => acc.id === selectedId);
        if (found) {
            setAccountFrom(found.accountName);
        } else {
            setAccountFrom("");
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrorMessage("");

        let budgetFromValue: string | null = null;
        if (budgetId !== "") {
            const selectedBudget: Budget | undefined = budgets.find((b) => b.id === Number(budgetId));
            if (selectedBudget) {
                budgetFromValue = selectedBudget.description || selectedBudget.category;
            }
        }
        if (endDate !== "" && endDate < date) {
            setErrorMessage("End date cannot be before the transaction date.");
            return;
        }

        const requestData: UpdateTransactionRequest = {
            amount: parseFloat(amount),
            description,
            budgetFrom: budgetFromValue,
            accountFrom,
            category,
            transactionOccurrence,
            date,
            endDate: endDate === "" ? null : endDate,
            userId: user?.id as number,
            budgetId: budgetId === "" ? null : Number(budgetId),
            accountId: Number(accountId),
        };

        try {
            await updateTransaction(transactionId, requestData, user.sessionUuid || "");

            setDescription("");
            setAmount("");
            setDate("");
            setEndDate("");
            setCategory("GROCERIES");
            setTransactionOccurrence("ONCE");
            setAccountId("");
            setAccountFrom("");
            setBudgetId("");
            router.push("/transactions");
        } catch (error) {
            console.error("Error updating transaction:", error);
            setErrorMessage((error as Error).message || "Failed to update transaction.");
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading transaction...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 space-y-6 max-w-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-300">
                <h1 className="text-2xl font-bold text-gray-800">Edit Transaction</h1>
            </div>
            {errorMessage && (
                <div className="px-6">
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Description
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Amount
                    </label>
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
                    <label className="text-gray-700 mb-1 block">
                        Account
                    </label>
                    <select
                        value={accountId}
                        onChange={handleAccountChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.accountName} ({account.accountType})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">
                        End date
                        <span className="text-sm text-gray-500">(Optional)</span>
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        min={date}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Occurrence
                    </label>
                    <select
                        value={transactionOccurrence}
                        onChange={(e) => setTransactionOccurrence(e.target.value as TransactionEvents)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Reoccurrence</option>
                        {TRANSACTIONEVENTS.map((tEvents) => (
                            <option key={tEvents} value={tEvents}>
                                {tEvents}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Budget (Optional)
                    </label>
                    <select
                        value={budgetId}
                        onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">No Budget</option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.id}>
                                {budget.category} (${budget.amount})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-700 mb-1 block">
                        Category
                    </label>
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
                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/transactions")}
                        className="bg-slate-500 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-slate-600 text-white p-2 rounded text-sm hover:bg-slate-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function UpdateTransactionPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-base">Loading...</p>
            </div>
        }>
            <UpdateTransactionForm />
        </Suspense>
    );
}