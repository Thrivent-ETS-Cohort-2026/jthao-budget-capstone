import { Categories } from "./categories";

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    budgetFrom: string | null;
    accountFrom: string;
    category: Categories;
    transactionOccurrence: TransactionEvent;
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
    category: Categories;
    transactionOccurrence: TransactionEvent;
    date: string;
    userId: number;
    budgetId: number | null;
    accountId: number;
}

export type TransactionEvent =
    "ONCE" |
    "DAILY" |
    "WEEKLY" |
    "MONTHLY" |
    "QUARTERLY" |
    "YEARLY";
