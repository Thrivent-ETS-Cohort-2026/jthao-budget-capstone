import { Transaction } from "@/app/types/transaction";

export function getForecastMonthKeys(startDate: string, numberOfMonths: number): string[] {
    const [year, month] = startDate.split("-").map(Number);
    const keys: string[] = [];

    for (let offset = 0; offset < numberOfMonths; offset += 1) {
        const monthIndex = year * 12 + (month - 1) + offset;
        const targetYear = Math.floor(monthIndex / 12);
        const targetMonth = (monthIndex % 12) + 1;
        keys.push(`${targetYear}-${String(targetMonth).padStart(2, "0")}`);
    }
    return keys;
}

export function getEndOfForecastMonth(startDate: string, monthOffset: number): string {
    const [year, month] = startDate.split("-").map(Number);
    const monthIndex = year * 12 + (month - 1) + monthOffset;
    const targetYear = Math.floor(monthIndex / 12);
    const targetMonth = monthIndex % 12;
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();

    return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}


export function getTransactionMatchKey(date: string, transaction: Transaction): string {
    const amountInCents = Math.round(Number(transaction.amount) * 100);
    const description = (transaction.description ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
    const account = String(
        transaction.accountId ?? transaction.accountFrom ?? "",
    ).trim().toLowerCase();

    return `${date}|${amountInCents}|${transaction.category}|${description}|${account}`;
}


export function getStartOfCurrentMonth(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
}