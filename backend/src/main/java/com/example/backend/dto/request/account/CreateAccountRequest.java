package com.example.backend.dto.request.account;

import com.example.backend.types.AccountType;

public class CreateAccountRequest {
    private AccountType accountType;
    private String accountName;
    private Long userId;

    // Getters

    public AccountType getAccountType() {
        return accountType;
    }
    
    public String getAccountName() {
        return accountName;
    }

    public Long getUserId() {
        return userId;
    }
}
