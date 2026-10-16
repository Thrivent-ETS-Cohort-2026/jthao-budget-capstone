package com.example.backend.validation;

import com.example.backend.types.AccountType;
import com.example.backend.model.User;

public class AccountValidation {
    public static void validateAccount(AccountType accountType, String accountName, User user) {
        if (accountName == null || accountName.isBlank()) {
            throw new IllegalArgumentException("Account name cannot be null or empty");
        }
        if (accountType == null) {
            throw new IllegalArgumentException("Account type cannot be null");
        }
        if (user == null) {
            throw new IllegalArgumentException("Account must be associated with a user");
        }
    }
}