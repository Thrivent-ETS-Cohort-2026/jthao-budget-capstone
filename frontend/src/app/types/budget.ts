export interface Budget {
    id: number;
    amount: number;
    description: string;
    targetPeriod: string;
    isEnabled: boolean;
    category: string;
    userId: number;
}

export interface CreateBudgetRequest {
    amount: number;
    description: string;
    targetPeriod: string;
    isEnabled: boolean | null;
    category: string;
    userId: number;
}