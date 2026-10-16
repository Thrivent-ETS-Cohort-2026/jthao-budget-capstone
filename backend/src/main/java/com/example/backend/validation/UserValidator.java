package com.example.backend.validation;

public class UserValidator {

    public static void validateUser(String fName, String lName, String eMail, String phoneNumber, String password) {
        validateFirstName(fName);
        validateLastName(lName);
        validateEmail(eMail);
        validatePhoneNumber(phoneNumber);
        validatePassword(password);
    }

    public static void validateFirstName(String firstName) {
        if (firstName == null || firstName.isBlank()) {
            throw new IllegalArgumentException("First name cannot be null or empty");
        }
    }

    public static void validateLastName(String lastName) {
        if (lastName == null || lastName.isBlank()) {
            throw new IllegalArgumentException("Last name cannot be null or empty");
        }
    }

    public static void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Please provide a valid email.");
        }
    }

    public static void validatePhoneNumber(String phoneNum) {
        if (phoneNum == null || phoneNum.isBlank()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        for (int i = 0; i < phoneNum.length(); i++) {
            if (!Character.isDigit(phoneNum.charAt(i))) {
                throw new IllegalArgumentException("Please only enter numbers with no dashes, spaces, or parenthesis.");
            }
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
    }
}