package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.request.budget.CreateBudgetRequest;
import com.example.backend.dto.request.budget.UpdateBudgetRequest;
import com.example.backend.dto.response.budget.BudgetResponse;
import com.example.backend.model.Budget;
import com.example.backend.model.Transaction;
import com.example.backend.model.User;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;

@Service 
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final SessionService sessionService;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository, 
            TransactionRepository transactionRepository, SessionService sessionService) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.sessionService = sessionService;
    }

    private void validateSession(String sessionUuid, Long expectedUserId) {
        Long tokenUserId = sessionService.getUserIdBySession(sessionUuid);
        if (tokenUserId == null || !tokenUserId.equals(expectedUserId)) {
            throw new SecurityException("Invalid or expired session token.");
        }
    }

    @Transactional
    public BudgetResponse createBudget(String sessionUuid, CreateBudgetRequest request) {
        validateSession(sessionUuid, request.getUserId());

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
            
        budgetRepository.findByCategoryAndTargetPeriodAndUserId(request.getCategory(), request.getTargetPeriod(), user.getId())
            .ifPresent(existingBudget -> {
                if (existingBudget.getIsEnabled() == true) {
                    existingBudget.setIsEnabled(false);
                }
            });
        
        Budget newBudget = new Budget(
            request.getAmount(),
            request.getDescription(),
            request.getTargetPeriod(),
            request.getCategory(),
            user
        );
        budgetRepository.save(newBudget);

        return new BudgetResponse(
            newBudget.getId(),
            newBudget.getAmount(),
            newBudget.getDescription(),
            newBudget.getTargetPeriod(),
            newBudget.getIsEnabled(),
            newBudget.getCategory(),
            user.getId()
        );
    }

    public BudgetResponse getBudgetById(Long id, String sessionUuid) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
            
        validateSession(sessionUuid, budget.getUser().getId());

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

    @Transactional
    public void deleteBudget(Long id, String sessionUuid) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
            
        validateSession(sessionUuid, budget.getUser().getId());

        List<Transaction> transactionList = transactionRepository.findByUserIdAndBudgetId(budget.getUser().getId(), budget.getId());
        for (Transaction transaction : transactionList) {
            transaction.setBudget(null);
        }
        budgetRepository.delete(budget);
    }

    public BudgetResponse updateBudget(Long id, String sessionUuid, UpdateBudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + id));
            
        validateSession(sessionUuid, budget.getUser().getId());
        
        if (request.getAmount() != null) {
            budget.setAmount(request.getAmount());
        }
        if (request.getDescription() != null) {
            budget.setDescription(request.getDescription());
        }
        if (request.getTargetPeriod() != null) {
            budget.setTargetPeriod(request.getTargetPeriod());
        }
        if (request.getIsEnabled() != null) {
            budget.setIsEnabled(request.getIsEnabled());
        }
        if (request.getCategory() != null) {
            budget.setCategory(request.getCategory());
        }
        
        Budget updatedBudget = budgetRepository.save(budget);
        
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

    public List<BudgetResponse> getBudgetByUserId(Long userId, String sessionUuid) {
        validateSession(sessionUuid, userId);

        List<Budget> budgetList = budgetRepository.findByUserId(userId);
        List<BudgetResponse> budgetResponseList = new ArrayList<>();
        for (Budget b : budgetList) {
            BudgetResponse response = new BudgetResponse(
                b.getId(),
                b.getAmount(),
                b.getDescription(),
                b.getTargetPeriod(),
                b.getIsEnabled(),
                b.getCategory(),
                userId
            );
            budgetResponseList.add(response);
        }
        return budgetResponseList;
    }
}