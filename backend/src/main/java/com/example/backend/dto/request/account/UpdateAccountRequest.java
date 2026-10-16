package com.example.backend.dto.request.account;

import com.example.backend.types.AccountType;

public class UpdateAccountRequest {
    private AccountType accountType;
    private String accountName;

    // Getters and Setters
    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
}
