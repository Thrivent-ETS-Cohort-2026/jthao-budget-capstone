package com.example.backend.model;

import com.example.backend.types.AccountType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "account_type", nullable = false)
    AccountType accountType;

    @Column(name = "account_name", nullable = false)
    String accountName;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;


    protected Account() {
    }

    public Account(AccountType accountType, String accountName, User user) {
        // add validation logic here if needed

        this.accountType = accountType;
        this.accountName = accountName;
        this.user = user;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
