import { Transaction, TransactionEvents } from "@/app/types/transaction";

export function getProjectedDates(
    transaction: Transaction,
    windowStart: string,
    windowEnd: string,
): string[] {
    const occurrence: TransactionEvents = transaction.transactionOccurrence;
    if (!occurrence || occurrence === "ONCE") {
        return [];
    }

    const anchor: Date | null = parseDateOnly(transaction.date);
    const start: Date | null = parseDateOnly(windowStart);
    const end: Date | null = parseDateOnly(windowEnd);

    if (!anchor || !start || !end || start.getTime() > end.getTime()) {
        return [];
    }

    const dates: string[] = [];
    const anchorDay: number = anchor.getUTCDate();
    let cursor: Date = anchor;
    let iterations: number = 0;
    const maxIterations: number = 100000;

    while (iterations < maxIterations) {
        iterations += 1;
        const next: Date | null = getNextOccurrence(cursor, occurrence, anchorDay);
        if (!next || next.getTime() > end.getTime()) {
            break;
        }

        cursor = next;
        if (cursor.getTime() >= start.getTime()) {
            dates.push(formatDateOnly(cursor));
        }
    }
    return dates;
}

function parseDateOnly(value: string): Date | null {
    const match: RegExpExecArray | null = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
        return null;
    }

    const year: number = Number(match[1]);
    const month: number = Number(match[2]);
    const day: number = Number(match[3]);
    const date: Date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }
    return date;
}

function getNextOccurrence(current: Date, occurrence: TransactionEvents, anchorDay: number): Date | null {
    const next: Date = new Date(current.getTime());

    if (occurrence === "DAILY") {
        next.setUTCDate(next.getUTCDate() + 1);
        return next;
    }

    if (occurrence === "WEEKLY") {
        next.setUTCDate(next.getUTCDate() + 7);
        return next;
    }

    if (occurrence === "MONTHLY" || occurrence === "QUARTERLY") {
        const monthsToAdd = occurrence === "MONTHLY" ? 1 : 3;
        const targetMonthIndex =
            next.getUTCFullYear() * 12 +
            next.getUTCMonth() +
            monthsToAdd;

        const targetYear: number = Math.floor(targetMonthIndex / 12);
        const targetMonth: number = targetMonthIndex % 12;

        const lastDayOfTargetMonth: number = new Date(
            Date.UTC(targetYear, targetMonth + 1, 0),
        ).getUTCDate();

        next.setUTCFullYear(
            targetYear,
            targetMonth,
            Math.min(anchorDay, lastDayOfTargetMonth),
        );
        return next;
    }

    if (occurrence === "YEARLY") {
        const targetYear = next.getUTCFullYear() + 1;
        const month = next.getUTCMonth();

        const lastDayOfTargetMonth: number = new Date(
            Date.UTC(targetYear, month + 1, 0),
        ).getUTCDate();

        next.setUTCFullYear(
            targetYear,
            month,
            Math.min(anchorDay, lastDayOfTargetMonth),
        );
        return next;
    }
    return null;
}

function formatDateOnly(date: Date): string {
    const year: number = date.getUTCFullYear();
    const month: string = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day: string = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}