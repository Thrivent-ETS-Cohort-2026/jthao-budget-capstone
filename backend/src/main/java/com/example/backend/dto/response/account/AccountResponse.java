package com.example.backend.dto.response.account;

import com.example.backend.types.AccountType;

public class AccountResponse {
    private Long id;
    private String accountName;
    private AccountType accountType;
    private Long userId;

    public AccountResponse(Long id, String accountName, AccountType accountType, Long userId) {
        this.id = id;
        this.accountName = accountName;
        this.accountType = accountType;
        this.userId = userId;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getAccountName() {
        return accountName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public Long getUserId() {
        return userId;
    }
}
