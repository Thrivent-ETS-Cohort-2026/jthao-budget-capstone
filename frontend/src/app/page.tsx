import Link from "next/link";


export default function Home() {
  return (
    <main>
      <div className="m-1 p-5 flex flex-col items-center">
        <h1>Welcome to the Budget App</h1>
        <div className="m-3">
            <Link href="/signup"
            className="m-1 p-1 border border-gray-300 rounded bg-gray-200"
            >
              Sign Up
            </Link>
            <Link href="/login"
            className="m-1 p-1 border border-gray-300 rounded bg-gray-200"
            >
              Log In
            </Link>
          </div>
      </div>
    </main>
  );
}
