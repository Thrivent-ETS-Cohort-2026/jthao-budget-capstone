export interface Transaction {
    id: number;
    amount: number;
    description: string;
    budgetFrom: string | null;
    accountFrom: string;
    category: string;
    transactionOccurrence: string;
    date: string;
    userId: number;
    budgetId: number | null;
    accountId: number;
}

export interface CreateTransactionRequest {
    amount: number;
    description: string;
    budgetFrom: string | null;
    accountFrom: string;
    category: string;
    transactionOccurrence: string;
    date: string;
    userId: number;
    budgetId: number | null;
    accountId: number;
}