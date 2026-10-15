export interface Transaction {
    id: number;
    transactionAmount: number;
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
    transactionAmount: number;
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