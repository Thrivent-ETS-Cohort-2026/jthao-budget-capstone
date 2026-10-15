package com.example.backend.dto.request.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.backend.types.Categories;
import com.example.backend.types.TransactionEvent;

public class CreateTransactionRequest {

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

    // Getters

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

    public TransactionEvent getTransactionOccurrence() {
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

}
