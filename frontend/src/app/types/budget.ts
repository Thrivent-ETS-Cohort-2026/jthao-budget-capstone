import { Categories } from "./categories";
import { TransactionEvents } from "./transaction";

export interface Budget {
    id: number;
    amount: number;
    description: string;
    targetPeriod: TransactionEvents;
    isEnabled: boolean;
    category: Categories;
    userId: number;
}

export interface CreateBudgetRequest {
    amount: number;
    description: string;
    targetPeriod: TransactionEvents;
    isEnabled: boolean | null;
    category: Categories;
    userId: number;
}