package com.example.backend.dto.response.transaction;

import java.math.BigDecimal;

import com.example.backend.types.Categories;

/**
 * TransactionResponse
 */
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private String budgetFrom;
    private String accountFrom;
    private Categories category;
    private String date;
    private Long userId;
    private Long budgetId;
    private Long accountId;

    // Getters

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getBudgetFrom() {
        return budgetFrom;
    }

    public String getAccountFrom() {
        return accountFrom;
    }

    public Categories getCategory() {
        return category;
    }

    public String getDate() {
        return date;
    }
    
    public Long getUserId() {
        return userId;
    }

    public Long getBudgetId() {
        return budgetId;
    }

    public Long getAccountId() {
        return accountId;
    }
    
}
