import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto p-6 space-y-6 max-w-xl mt-10 bg-gray-50">
      <div className="flex items-center p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Budget App</h1>
      </div>
      <div className="border border-gray-300 p-6 rounded space-y-6">
        <p className="text-gray-600 text-base leading-relaxed">
          Take control of your finances. Track your expenses, manage custom category budgets, and monitor your spending goals all in one simple place.
        </p>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Link
            href="/sign-up"
            className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}