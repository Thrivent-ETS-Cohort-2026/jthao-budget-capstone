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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center">
        <p className="text-gray-600 mb-4">Please log in to create accounts.</p>
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
      await createAccount(requestData);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage((error as Error).message || "Failed to create account.");
    }
  };

  return (
    <div className=" mx-auto p-6 mt-10 border border-gray-300 rounded">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Create New Account</h1>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="accountName" className="text-gray-700">
            Account Name
          </label>
          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., Checking"
            required
          />
        </div>
        <div>
          <label htmlFor="accountType" className="text-gray-700">
            Account Type
          </label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
            <option value="CREDIT">Credit</option>
            <option value="INVESTMENT">Investment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-600 text-white p-2 m-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 m-2 rounded hover:bg-blue-700"
          >
            Save Account
          </button>
        </div>
      </form>
    </div>
  );
}