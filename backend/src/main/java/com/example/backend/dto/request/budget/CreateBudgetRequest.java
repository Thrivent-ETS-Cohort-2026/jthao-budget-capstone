package com.example.backend.dto.request.budget;

import java.math.BigDecimal;

import com.example.backend.types.TransactionEvent;
import com.example.backend.types.Categories;

public class CreateBudgetRequest {

    private BigDecimal amount;
    private String description;
    private TransactionEvent targetPeriod;
    private Boolean isEnabled;
    private Categories category;
    private Long userId;

    // Getters

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public TransactionEvent getTargetPeriod() {
        return targetPeriod;
    }

    public Boolean getIsActive() {
        return isEnabled;
    }
    
    public Categories getCategory() {
        return category;
    }

    public Long getUserId() {
        return userId;
    }

}
