"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { createAccount } from "@/app/lib/api/accounts";
import { AccountType, CreateAccountRequest } from "@/app/types/account";

export default function NewAccount() {
  const router = useRouter();
  const { user } = useUser();

  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("CHECKING");
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-center">
        <p className="text-gray-600 mb-4">Please log in to create accounts.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-orange-400 text-black p-2 rounded hover:bg-orange-500"
        >
          Go to home page
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!accountName.trim()) {
      setErrorMessage("Account name is required.");
      return;
    }

    const requestData: CreateAccountRequest = {
      accountName,
      accountType,
      userId: user.id,
    };

    try {
      await createAccount(requestData, user.sessionUuid || "");

      setAccountName("");
      setAccountType("CHECKING");
      setErrorMessage("");

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage((error as Error).message || "Failed to create account.");
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6 max-w-xl bg-white border border-orange-400">
      <div className="flex justify-between items-center p-6 border-b border-orange-300">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Create New Account</h1>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="border border-gray-300 p-6 rounded space-y-4">
        <div>
          <label htmlFor="accountName" className="text-gray-700 mb-1 block">
            Account Name
          </label>
          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded bg-gray-50"
            placeholder="e.g., Checking"
            required
          />
        </div>
        <div>
          <label htmlFor="accountType" className="text-gray-700 mb-1 block">
            Account Type
          </label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            className="w-full p-2 border border-gray-200 rounded bg-gray-50"
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
            <option value="CREDIT">Credit</option>
            <option value="INVESTMENT">Investment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-orange-100 border border-orange-200 text-black p-2 rounded hover:bg-orange-200 hover:border-orange-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-400 border border-orange-400 text-black p-2 rounded hover:bg-orange-500 hover:border-orange-600"
          >
            Save Account
          </button>
        </div>
      </form>
    </div>
  );
}