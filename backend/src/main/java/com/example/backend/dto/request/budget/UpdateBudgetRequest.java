package com.example.backend.dto.request.budget;

public class UpdateBudgetRequest {
    private String description;
    private String targetPeriod;
    private Boolean isEnabled;

    // Getters

    public String getDescription() {
        return description;
    }

    public String getTargetPeriod() {
        return targetPeriod;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

}
