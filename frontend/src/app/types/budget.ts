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

export type BudgetRequest = Partial<Omit<Budget, "id">>;