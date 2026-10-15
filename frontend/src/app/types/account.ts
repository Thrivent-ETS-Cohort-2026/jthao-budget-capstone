
export interface Account {
    id: number;
    accountType: string;
    accountName: string;
    userId: number;
    
}

export interface CreateAccountRequest {
    accountType: string;
    accountName: string;
    userId: number;
}