package com.example.backend.validation;

import java.math.BigDecimal;
import java.time.LocalDate;
import com.example.backend.types.Categories;
import com.example.backend.types.TransactionEvent;
import com.example.backend.model.User;
import com.example.backend.model.Account;

public class TransactionValidation {
    public static void validate(BigDecimal amount, Categories category, TransactionEvent transactionOccurrence, 
                                LocalDate date, User user, Account account) {
        if (amount == null) {
            throw new IllegalArgumentException("Transaction amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than zero");
        }
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        if (transactionOccurrence == null) {
            throw new IllegalArgumentException("Transaction occurrence cannot be null");
        }
        if (date == null) {
            throw new IllegalArgumentException("Transaction date cannot be null");
        }
        if (user == null) {
            throw new IllegalArgumentException("Transaction must be associated with a user");
        }
        if (account == null) {
            throw new IllegalArgumentException("Transaction must be associated with an account");
        }
    }
}