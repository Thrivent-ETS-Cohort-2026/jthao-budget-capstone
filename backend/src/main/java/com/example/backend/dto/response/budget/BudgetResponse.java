package com.example.backend.dto.response.budget;

import java.math.BigDecimal;

import com.example.backend.types.BudgetPeriod;
import com.example.backend.types.Categories;

public class BudgetResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private BudgetPeriod targetPeriod;
    private Boolean isEnabled;
    private Categories category;
    private Long userId;

    public BudgetResponse(Long id, BigDecimal amount, String description, BudgetPeriod targetPeriod, Boolean isEnabled, Categories category, Long userId) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.targetPeriod = targetPeriod;
        this.isEnabled = isEnabled;
        this.category = category;
        this.userId = userId;
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

    public BudgetPeriod getTargetPeriod() {
        return targetPeriod;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public Categories getCategory() {
        return category;
    }

    public Long getUserId() {
        return userId;
    }

}