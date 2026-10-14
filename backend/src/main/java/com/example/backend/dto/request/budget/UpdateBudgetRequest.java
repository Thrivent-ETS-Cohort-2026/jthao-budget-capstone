package com.example.backend.dto.request.budget;

import java.math.BigDecimal;

import com.example.backend.types.BudgetPeriod;
import com.example.backend.types.Categories;

public class UpdateBudgetRequest {

    private BigDecimal amount;
    private String description;
    private BudgetPeriod targetPeriod;
    private Boolean isEnabled;
    private Categories category;

    // Getters

    public String getDescription() {
        return description;
    }

    public BudgetPeriod getTargetPeriod() {
        return targetPeriod;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public BigDecimal getAmount() {
    return amount;
    }

    public Categories getCategory() {
        return category;
    }

}
