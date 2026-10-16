
export interface Account {
    id: number;
    accountType: AccountType;
    accountName: string;
    userId: number;

}

export interface CreateAccountRequest {
    accountType: AccountType;
    accountName: string;
    userId: number;
}

export interface UpdateAccountRequest {
    accountName?: string;
    accountType?: string;
}

export type AccountType =
    "CHECKING" |
    "SAVINGS" |
    "CREDIT" |
    "INVESTMENT" |
    "OTHER";

    export const ACCOUNT_TYPES: AccountType[] = [
    "CHECKING",
    "SAVINGS",
    "CREDIT",
    "INVESTMENT",
    "OTHER",
];