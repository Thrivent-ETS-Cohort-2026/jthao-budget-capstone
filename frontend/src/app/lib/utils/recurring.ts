import { Transaction, TransactionEvents } from "@/app/types/transaction";

export function getProjectedDates(transaction: Transaction, limit: number = 12): string[] {
    const dates: string[] = [];
    const occurrence: TransactionEvents = transaction.transactionOccurrence;
    if (!occurrence || occurrence === "ONCE") {
        return dates;
    }

    const nextDate: Date = new Date(transaction.date);
    for (let i = 0; i < limit; i++) {
        if (occurrence === "DAILY") {
            nextDate.setDate(nextDate.getDate() + 1);
        }
        else if (occurrence === "WEEKLY") {
            nextDate.setDate(nextDate.getDate() + 7);
        }
        else if (occurrence === "MONTHLY") {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }
        else if (occurrence === "QUARTERLY") {
            nextDate.setMonth(nextDate.getMonth() + 3);
        }
        else if (occurrence === "YEARLY") {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        else break;

        dates.push(nextDate.toISOString().split("T")[0]);
    }
    return dates;
}