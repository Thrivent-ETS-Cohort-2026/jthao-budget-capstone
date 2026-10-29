
interface DashboardEmptyStateProps {
  onCreateAccount: () => void;
}

export default function EmptyStateDashboard({
  onCreateAccount,
}: DashboardEmptyStateProps) {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 m-2">
        No Accounts Found
      </h2>
      <p className="text-gray-600 m-2">
        Please create an account before adding budgets or logging transactions.
      </p>
      <button
        onClick={onCreateAccount}
        className="bg-orange-400 text-black p-2 rounded text-sm hover:bg-orange-500"
      >
        Add Account
      </button>
    </div>
  );
}