package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndDeletedAtIsNullOrderByDateDesc(Long id);

    List<Transaction> findByUserIdAndBudgetId(Long userId, Long budgetId);

    List<Transaction> findByUserId(Long id);
}
