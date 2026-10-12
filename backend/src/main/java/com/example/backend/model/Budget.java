package com.example.backend.model;

import java.math.BigDecimal;

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
    String desciption;

    @Column (name = "target_period", nullable = false)
    String targetPeriod;

    @Column (name = "is_enabled", nullable = false)
    Boolean isEnabled;

    @Enumerated(EnumType.STRING)
    @Column (name = "category", nullable = false)
    Categories category;

    protected Budget() {
    }

    public Budget(BigDecimal amount, String desciption, String targetPeriod, Boolean isEnabled, Categories category) {
        // add validation logic here if needed

        this.amount = amount;
        this.desciption = desciption;
        this.targetPeriod = targetPeriod;
        this.isEnabled = isEnabled;
        this.category = category;
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

    public String getDesciption() {
        return desciption;
    }

    public void setDesciption(String desciption) {
        this.desciption = desciption;
    }

    public String getTargetPeriod() {
        return targetPeriod;
    }

    public void setTargetPeriod(String targetPeriod) {
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

}
