import { Categories } from "./categories";

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    budgetFrom?: string;
    accountFrom: string;
    category: Categories;
    transactionOccurrence: TransactionEvents;
    date: string;
    deletedAt: string | null;
    userId: number;
    budgetId?: number;
    accountId: number;
}

export interface CreateTransactionRequest {
    amount: number;
    description: string;
    budgetFrom?: string;
    accountFrom: string;
    category: Categories;
    transactionOccurrence: TransactionEvents;
    date: string;
    userId: number;
    budgetId?: number;
    accountId: number;
}

export type TransactionEvents =
    "ONCE" |
    "DAILY" |
    "WEEKLY" |
    "MONTHLY" |
    "QUARTERLY" |
    "YEARLY";

export const TRANSACTIONEVENTS: TransactionEvents[] = [
    "ONCE",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "YEARLY",
];

export interface UpdateTransactionRequest {
    amount: number;
    description: string;
    budgetFrom?: string;
    accountFrom: string;
    category: Categories;
    transactionOccurrence: TransactionEvents;
    date: string;
    userId: number;
    budgetId?: number;
    accountId: number;
}