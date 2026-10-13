package com.example.backend.dto.response.account;

public class AccountResponse {
    private Long id;
    private String accountName;
    private String accountType;
    private Long userId;

    public AccountResponse(Long id, String accountName, String accountType, Long userId) {
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

    public String getAccountType() {
        return accountType;
    }

    public Long getUserId() {
        return userId;
    }
}
