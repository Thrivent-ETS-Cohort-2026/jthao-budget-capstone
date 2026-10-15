import { Categories } from "./categories";
import { TransactionEvent } from "./transaction";

export interface Budget {
    id: number;
    amount: number;
    description: string;
    targetPeriod: TransactionEvent;
    isEnabled: boolean;
    category: Categories;
    userId: number;
}

export interface CreateBudgetRequest {
    amount: number;
    description: string;
    targetPeriod: TransactionEvent;
    isEnabled: boolean | null;
    category: Categories;
    userId: number;
}