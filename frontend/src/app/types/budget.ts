import { Categories } from "./categories";

export interface Budget {
    id: number;
    amount: number;
    description: string;
    targetPeriod: string;
    isEnabled: boolean;
    category: Categories;
    userId: number;
}

export interface CreateBudgetRequest {
    amount: number;
    description: string;
    targetPeriod: string;
    isEnabled: boolean | null;
    category: Categories;
    userId: number;
}