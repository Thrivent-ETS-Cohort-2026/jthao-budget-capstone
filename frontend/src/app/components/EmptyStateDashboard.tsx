
interface DashboardEmptyStateProps {
  onCreateAccount: () => void;
}

export default function EmptyStateDashboard({
  onCreateAccount,
}: DashboardEmptyStateProps) {

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 m-2">
        No Accounts Found
      </h2>
      <p className="text-gray-600 m-2">
        Please create an account before adding budgets or logging transactions.
      </p>
      <button
        onClick={onCreateAccount}
        className="bg-blue-600 text-white p-3 rounded"
      >
        Add Account
      </button>
    </div>
  );
}