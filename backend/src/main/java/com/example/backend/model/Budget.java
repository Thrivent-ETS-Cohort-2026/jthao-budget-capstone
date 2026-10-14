package com.example.backend.model;

import java.math.BigDecimal;

import com.example.backend.types.TransactionEvent;
import com.example.backend.types.Categories;

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
@Table(name = "budgets")
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount", nullable = false)
    BigDecimal amount;

    @Column(name = "description", nullable = false)
    String description;

    @Enumerated(EnumType.STRING)
    @Column (name = "target_period", nullable = false)
    TransactionEvent targetPeriod;

    @Column (name = "is_enabled", nullable = false)
    Boolean isEnabled;

    @Enumerated(EnumType.STRING)
    @Column (name = "category", nullable = false)
    Categories category;

    @ManyToOne
    @JoinColumn (name = "user_id", nullable = false)
    User user;

    protected Budget() {
    }

    public Budget(BigDecimal amount, String description, TransactionEvent targetPeriod, Boolean isEnabled, Categories category, User user) {
        // add validation logic here if needed

        this.amount = amount;
        this.description = description;
        this.targetPeriod = targetPeriod;
        this.isEnabled = isEnabled;
        this.category = category;
        this.user = user;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TransactionEvent getTargetPeriod() {
        return targetPeriod;
    }

    public void setTargetPeriod(TransactionEvent targetPeriod) {
        this.targetPeriod = targetPeriod;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public Categories getCategory() {
        return category;
    }

    public void setCategory(Categories category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
