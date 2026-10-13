package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.request.budget.CreateBudgetRequest;
import com.example.backend.dto.response.budget.BudgetResponse;
import com.example.backend.model.Budget;
import com.example.backend.model.User;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.UserRepository;

@Service 
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createBudget(CreateBudgetRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
        budgetRepository.findByCategoryAndTargetPeriodAndUser(request.getCategory(), request.getTargetPeriod(), user.getId())
            .ifPresent(existingBudget -> {
                if (existingBudget.getIsEnabled() == true) {
                    existingBudget.setIsEnabled(false);
                }
            });
            budgetRepository.save(new Budget(
            request.getAmount(),
            request.getDescription(),
            request.getTargetPeriod(),
            request.getIsActive(),
            request.getCategory(),
            user
        ));
    }

    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
        return new BudgetResponse(
            budget.getId(),
            budget.getAmount(),
            budget.getDescription(),
            budget.getTargetPeriod(),
            budget.getIsEnabled(),
            budget.getCategory(),
            budget.getUser().getId()
        );
    }

    // Delete budget method
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }

    // Update budget method
    public BudgetResponse updateBudget(Long id, CreateBudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
        
        if (request.getAmount() != null) {
            budget.setAmount(request.getAmount());
        }
        if (request.getDescription() != null) {
            budget.setDescription(request.getDescription());
        }
        if (request.getTargetPeriod() != null) {
            budget.setTargetPeriod(request.getTargetPeriod());
        }
        if (request.getIsActive() != null) {
            budget.setIsEnabled(request.getIsActive());
        }
        if (request.getCategory() != null) {
            budget.setCategory(request.getCategory());
        }
        
        // Save the updated budget
        Budget updatedBudget = budgetRepository.saveAndFlush(budget);
        
        return new BudgetResponse(
            updatedBudget.getId(),
            updatedBudget.getAmount(),
            updatedBudget.getDescription(),
            updatedBudget.getTargetPeriod(),
            updatedBudget.getIsEnabled(),
            updatedBudget.getCategory(),
            updatedBudget.getUser().getId()
        );
    }



}
