// package com.example.backend.model;

// import java.math.BigDecimal;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
// import jakarta.persistence.Column;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;

// @Entity
// @Table(name = "accounts")
// public class Account {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(name = "account_number", nullable = false)
//     String accountNumber;

//     @Column(name = "balance", nullable = false)
//     BigDecimal balance;

//     @ManyToOne
//     @JoinColumn(name = "user_id", nullable = false)
//     User user;


//     protected Account() {
//     }

//     public Account(String accountNumber, BigDecimal balance, User user) {
//         // add validation logic here if needed

//         this.accountNumber = accountNumber;
//         this.balance = balance;
//         this.user = user;
//     }

//     // Getters and setters

//     public Long getId() {
//         return id;
//     }

//     public String getAccountNumber() {
//         return accountNumber;
//     }

//     public void setAccountNumber(String accountNumber) {
//         this.accountNumber = accountNumber;
//     }

//     public BigDecimal getBalance() {
//         return balance;
//     }

//     public void setBalance(BigDecimal balance) {
//         this.balance = balance;
//     }

//     public User getUser() {
//         return user;
//     }

//     public void setUser(User user) {
//         this.user = user;
//     }
// }
