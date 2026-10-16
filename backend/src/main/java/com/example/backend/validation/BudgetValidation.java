package com.example.backend.validation;

import java.math.BigDecimal;
import com.example.backend.types.TransactionEvent;
import com.example.backend.types.Categories;
import com.example.backend.model.User;

public class BudgetValidation {
    public static void validate(BigDecimal amount, TransactionEvent targetPeriod, Categories category, User user) {
        if (amount == null) {
            throw new IllegalArgumentException("Budget amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget amount must be greater than zero");
        }
        if (targetPeriod == null) {
            throw new IllegalArgumentException("Target period cannot be null");
        }
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        if (user == null) {
            throw new IllegalArgumentException("Budget must be associated with a user");
        }
    }
}