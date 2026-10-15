
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

export type AccountType =
    "CHECKING" |
    "SAVINGS" |
    "CREDIT" |
    "INVESTMENT" |
    "OTHER";