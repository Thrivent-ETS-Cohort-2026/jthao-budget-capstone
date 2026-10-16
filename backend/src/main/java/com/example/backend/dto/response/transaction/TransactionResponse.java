package com.example.backend.dto.response.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.backend.types.Categories;
import com.example.backend.types.TransactionEvent;

public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private String budgetFrom;
    private String accountFrom;
    private Categories category;
    private TransactionEvent transactionOccurrence;
    private LocalDate date;
    private Long userId;
    private Long budgetId;
    private Long accountId;
    private LocalDate deletedAt;

    public TransactionResponse(Long id, BigDecimal amount, String description, String budgetFrom, String accountFrom, Categories category, TransactionEvent transactionOccurrence, LocalDate date, Long userId, Long budgetId, Long accountId, LocalDate deletedAt) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.budgetFrom = budgetFrom;
        this.accountFrom = accountFrom;
        this.category = category;
        this.transactionOccurrence = transactionOccurrence;
        this.date = date;
        this.userId = userId;
        this.budgetId = budgetId;
        this.accountId = accountId;
        this.deletedAt = deletedAt;
    }

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

    public TransactionEvent getTransactionOccurrence(){
        return transactionOccurrence;
    }

    public LocalDate getDate() {
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

    public LocalDate getDeletedAt() {
        return deletedAt;
    }
}