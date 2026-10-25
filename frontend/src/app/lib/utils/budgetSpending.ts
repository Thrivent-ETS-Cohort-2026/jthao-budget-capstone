
import { Budget } from "@/app/types/budget";
import { Transaction, TransactionEvents } from "@/app/types/transaction";

export interface BudgetPeriodSpending {
    key: string;
    label: string;
    startDate: string;
    endDate: string;
    actualSpend: number;
    budgetAmount: number;
    percentage: number;
    isOverspent: boolean;
    isWarning: boolean;
}

function parseDateOnly(value: string): Date | null {
    if (!value) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

export function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getPeriodStart(
    date: Date,
    targetPeriod: TransactionEvents
): Date {
    const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    switch (targetPeriod) {
        case "ONCE":
        case "DAILY":
            // These periods are evaluated one calendar day at a time.
            break;

        case "WEEKLY": {
            // Sunday is the first day of the week.
            start.setDate(start.getDate() - start.getDay());
            break;
        }

        case "MONTHLY":
            start.setDate(1);
            break;

        case "QUARTERLY":
            start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
            break;

        case "YEARLY":
            start.setMonth(0, 1);
            break;
    }

    return start;
}

function getNextPeriodStart(
    start: Date,
    targetPeriod: TransactionEvents
): Date {
    const next = new Date(start);

    switch (targetPeriod) {
        case "ONCE":
        case "DAILY":
            next.setDate(next.getDate() + 1);
            break;

        case "WEEKLY":
            next.setDate(next.getDate() + 7);
            break;

        case "MONTHLY":
            next.setMonth(next.getMonth() + 1);
            break;

        case "QUARTERLY":
            next.setMonth(next.getMonth() + 3);
            break;

        case "YEARLY":
            next.setFullYear(next.getFullYear() + 1);
            break;
    }

    return next;
}

function getPeriodLabel(
    start: Date,
    end: Date,
    targetPeriod: TransactionEvents
): string {
    switch (targetPeriod) {
        case "ONCE":
        case "DAILY":
            return formatLocalDate(start);

        case "WEEKLY":
            return `${formatLocalDate(start)} – ${formatLocalDate(end)}`;

        case "MONTHLY":
            return new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
            }).format(start);

        case "QUARTERLY":
            return `Q${Math.floor(start.getMonth() / 3) + 1} ${start.getFullYear()}`;

        case "YEARLY":
            return String(start.getFullYear());
    }
}

export function getBudgetPeriodSpending(
    budget: Budget,
    transactions: Transaction[],
    startDate: string,
    endDate: string
): BudgetPeriodSpending[] {
    const selectedStart = parseDateOnly(startDate);
    const selectedEnd = parseDateOnly(endDate);
    const budgetAmount = Number(budget.amount);

    if (
        !selectedStart ||
        !selectedEnd ||
        selectedStart > selectedEnd ||
        !Number.isFinite(budgetAmount)
    ) {
        return [];
    }

    const periods: BudgetPeriodSpending[] = [];
    const periodsByKey = new Map<string, BudgetPeriodSpending>();

    let periodStart = getPeriodStart(
        selectedStart,
        budget.targetPeriod
    );

    const lastPeriodStart = getPeriodStart(
        selectedEnd,
        budget.targetPeriod
    );

    while (periodStart <= lastPeriodStart) {
        const nextStart = getNextPeriodStart(
            periodStart,
            budget.targetPeriod
        );

        const periodEnd = new Date(nextStart);
        periodEnd.setDate(periodEnd.getDate() - 1);

        const key = formatLocalDate(periodStart);

        const period: BudgetPeriodSpending = {
            key,
            label: getPeriodLabel(
                periodStart,
                periodEnd,
                budget.targetPeriod
            ),
            startDate: formatLocalDate(periodStart),
            endDate: formatLocalDate(periodEnd),
            actualSpend: 0,
            budgetAmount,
            percentage: 0,
            isOverspent: false,
            isWarning: false,
        };

        periods.push(period);
        periodsByKey.set(key, period);
        periodStart = nextStart;
    }

    for (const transaction of transactions) {
        if (
            transaction.deletedAt ||
            transaction.budgetId !== budget.id
        ) {
            continue;
        }

        const transactionDate = parseDateOnly(transaction.date);
        const amount = Number(transaction.amount);

        if (!transactionDate || !Number.isFinite(amount)) {
            continue;
        }

        if (
            transactionDate < selectedStart ||
            transactionDate > selectedEnd
        ) {
            continue;
        }

        const key = formatLocalDate(
            getPeriodStart(transactionDate, budget.targetPeriod)
        );

        const period = periodsByKey.get(key);

        if (period) {
            period.actualSpend += amount;
        }
    }

    for (const period of periods) {
        period.percentage =
            budgetAmount > 0
                ? (period.actualSpend / budgetAmount) * 100
                : period.actualSpend > 0
                    ? 100
                    : 0;

        period.isOverspent = period.percentage > 100;
        period.isWarning =
            period.percentage >= 75 && period.percentage < 100;
    }

    return periods;
}

export function isBudgetFullyUsed(
    actualSpend: number,
    budgetAmount: number
): boolean {
    return (
        Math.round(actualSpend * 100) ===
        Math.round(budgetAmount * 100)
    );
}