"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Transaction } from "@/app/types/transaction";
import { Account } from "@/app/types/account";
import { deleteTransaction, getTransactions } from "@/app/lib/api/transactions";
import { getAccounts } from "@/app/lib/api/accounts";
import Link from "next/link";
import { getApiErrorMessage } from "@/app/lib/api/errorHandling";

export default function TransactionsPage() {
    const router = useRouter();
    const { user } = useUser();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [accountFilter, setAccountFilter] = useState<string>("ALL");
    const itemsPerPage = 10;
    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setCategoryFilter("");
        setAccountFilter("ALL");
        setCurrentPage(1);
    };

    useEffect(() => {
        async function fetchData(): Promise<void> {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setStartDate("");
                setEndDate("");
                setCategoryFilter("");
                setAccountFilter("ALL");
                setCurrentPage(1);
                setErrorMessage("");
                setLoading(true);
                const transactionList: Transaction[] = await getTransactions(user.id, user.sessionUuid || "");
                setTransactions(transactionList);

                const accountRes: Account[] = await getAccounts(user.id, user.sessionUuid || "");
                setAccounts(accountRes);
            } catch (error: unknown) {
                setErrorMessage(getApiErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user?.id, user?.sessionUuid]);

    const filteredTransactions: Transaction[] = transactions
        .filter((transaction: Transaction) => {
            if (transaction.deletedAt) {
                return false;
            }
            if (startDate && transaction.date < startDate) {
                return false;
            }
            if (endDate && transaction.date > endDate) {
                return false;
            }
            if (categoryFilter.trim() && !transaction.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
                return false;
            }
            if (accountFilter !== "ALL" && transaction.accountFrom !== accountFilter) {
                return false;
            }
            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalPages: number = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const currentTransactions: Transaction[] = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    const handleExportCSV: () => void = () => {
        if (filteredTransactions.length === 0) return;
        const headers: string[] = ["Date", "Description", "Amount", "Account From", "Budget From", "Category"];
        
        const rows: (string | number)[][] = filteredTransactions.map(transaction => [
            transaction.date,
            `"${transaction.description.replace(/"/g, '""')}"`,
            transaction.amount,
            `"${transaction.accountFrom}"`,
            `"${transaction.budgetFrom || ""}"`,
            transaction.category
        ]);
        const csvContent: string = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const blob: Blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url: string = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-center">
                <p className="text-gray-600 mb-4">Please log in to view transactions.</p>
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
                <p className="text-gray-600 text-base">Loading transactions...</p>
            </div>
        );
    }

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmed) {
            return;
        }
        try {
            await deleteTransaction(id, user.sessionUuid || "");
            setTransactions((previousTransactions: Transaction[]) => {
                return previousTransactions.map((transaction: Transaction) => {
                    if (transaction.id === id) {
                        return { ...transaction, deletedAt: new Date().toISOString().split("T")[0] };
                    }
                    return transaction;
                });
            });
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="bg-slate-500 text-white p-2 rounded hover:bg-slate-600"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => router.push("/transactions/new")}
                        className="bg-slate-500 text-white p-2 rounded hover:bg-slate-600"
                    >
                        Add Transaction
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-slate-500 text-white p-2 rounded hover:bg-slate-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-white">
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-700">Filter Transactions</h2>
                        <span className="bg-gray-100 text-gray-600 p-1 rounded">
                            {filteredTransactions.length} found
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

                <div className="grid grid-cols-4 gap-3 mb-5">
                    <div>
                        <label className="text-xs text-gray-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1">Category</label>
                        <input
                            type="text"
                            placeholder="Filter category..."
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1">Account</label>
                        <select
                            value={accountFilter}
                            onChange={(e) => {
                                setAccountFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-1 border border-gray-300"
                        >
                            <option value="ALL">All Accounts</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.accountName}>
                                    {acc.accountName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {currentTransactions.length === 0 ? (
                    <p className="text-gray-400 text-center p-4">No transactions found.</p>
                ) : (
                    <div>
                        {errorMessage && (
                            <div className="px-6">
                                <p className="text-red-500 text-sm">{errorMessage}</p>
                            </div>
                        )}
                        <div className="border border-gray-200 rounded-lg overflow-scroll">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                                        <th className="p-3 border-x border-gray-200">Date</th>
                                        <th className="p-3 border-x border-gray-200">Description</th>
                                        <th className="p-3 border-x border-gray-200">Amount</th>
                                        <th className="p-3 border-x border-gray-200">Account From</th>
                                        <th className="p-3 border-x border-gray-200">Budget From</th>
                                        <th className="p-3 border-x border-gray-200">Category</th>
                                        <th className="p-3 border-x border-gray-200 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 text-gray-700">{transaction.date}</td>
                                            <td className="p-3 text-gray-700 font-medium">{transaction.description}</td>
                                            <td className="p-3 text-gray-700 font-semibold">${transaction.amount.toFixed(2)}</td>
                                            <td className="p-3 text-gray-700">{transaction.accountFrom}</td>
                                            <td className="p-3 text-gray-700">{transaction.budgetFrom || ""}</td>
                                            <td className="p-3">
                                                <span className="text-gray-600 p-1 rounded">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <Link
                                                    href={`/transactions/${transaction.id}/update`}
                                                    className="p-1 text-black bg-slate-300 border border-slate-500 rounded hover:bg-slate-500 hover:text-white text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="p-1 text-black bg-slate-300 border border-slate-500 rounded  hover:bg-slate-500 hover:text-white text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}