import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto p-6 space-y-6 max-w-xl mt-10 bg-white border border-orange-400">
      <div className="flex items-center p-6 border-b border-orange-400">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Budget App</h1>
      </div>
      <div className="border border-gray-300 p-6 rounded space-y-6">
        <p className="text-gray-600 text-base leading-relaxed">
          Take control of your finances. Track your expenses, manage custom category budgets, and monitor your spending goals all in one simple place.
        </p>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
          <Link
            href="/sign-up"
            className="bg-orange-100 border border-orange-300 text-black p-2 rounded hover:bg-orange-200"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-orange-400 border border-orange-400 text-black p-2 rounded hover:bg-orange-500 hover:border-orange-600"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}