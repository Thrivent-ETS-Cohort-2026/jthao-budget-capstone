

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function  exportTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions/export`);
    if (!response.ok) {
        throw new Error("Failed to export transactons");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
}