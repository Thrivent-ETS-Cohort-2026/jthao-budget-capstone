"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, setUser } = useUser();

    const handleSignOut = () => {
        setUser(null);
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {user && (
                <header className="border-b border-gray-200 bg-orange-400">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="font-bold text-3xl text-black hover:text-white"
                            >
                                Budget App
                            </button>
                            <nav className="flex space-x-4">
                                <button
                                    onClick={() => router.push("/budgets")}
                                    className="text-black font-medium hover:text-white "
                                >
                                    Budgets
                                </button>
                                <button
                                    onClick={() => router.push("/transactions")}
                                    className="text-black font-medium hover:text-white "
                                >
                                    Transactions
                                </button>
                                <button
                                    onClick={() => router.push("/report")}
                                    className="text-black font-medium hover:text-white "
                                >
                                    Reports
                                </button>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-black text-xl font-medium">
                                Hello, {user.firstName}
                            </span>
                            <button
                                onClick={() => router.push("/dashboard/user")}
                                className="bg-orange-100 text-gray-700 border border-orange-200 text-sm p-2 rounded hover:bg-gray-200 font-medium transition"
                            >
                                Account Settings
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="bg-orange-100 text-gray-700 border border-orange-200 text-sm p-2 rounded hover:bg-gray-200 font-medium transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>
            )}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 bg-gray-50">
                {children}
            </main>
        </div>
    );
}