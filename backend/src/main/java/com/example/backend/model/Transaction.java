package com.example.backend.model;

import java.math.BigDecimal;
import com.example.backend.types.Categories;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "transactions")
public class Transaction {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "amount", nullable = false)
        BigDecimal amount;

        @Column(name = "description", nullable = false)
        String description;

        @Column(name = "budget_from", nullable = false)
        String budgetFrom;

        @Column(name = "account_from", nullable = false)
        String accountFrom;

        
        Categories category;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        User user;

        @ManyToOne
        @JoinColumn(name = "budget_id", nullable = false)
        Budget budget;


        protected Transaction() {
        }

        public Transaction(BigDecimal amount, String description, String budgetFrom, String accountFrom, Categories category, User user, Budget budget) {
            // add validation logic here if needed

            this.amount = amount;
            this.description = description;
            this.budgetFrom = budgetFrom;
            this.accountFrom = accountFrom;
            this.category = category;
            this.user = user;
            this.budget = budget;
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

        public String getBudgetFrom() {
            return budgetFrom;
        }

        public void setBudgetFrom(String budgetFrom) {
            this.budgetFrom = budgetFrom;
        }

        public String getAccountFrom() {
            return accountFrom;
        }

        public void setAccountFrom(String accountFrom) {
            this.accountFrom = accountFrom;
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

        public Budget getBudget() {
            return budget;
        }

        public void setBudget(Budget budget) {
            this.budget = budget;
        }


}
