package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Budget;
import com.example.backend.types.TransactionEvent;
import com.example.backend.types.Categories;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByCategoryAndTargetPeriodAndUserId(Categories category, TransactionEvent targetPeriod, Long id);

}
