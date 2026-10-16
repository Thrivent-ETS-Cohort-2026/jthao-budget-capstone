package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.request.transaction.CreateTransactionRequest;
import com.example.backend.dto.response.transaction.TransactionResponse;
import com.example.backend.model.Account;
import com.example.backend.model.Budget;
import com.example.backend.model.Transaction;
import com.example.backend.model.User;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final AccountRepository accountRepository;
    private final SessionService sessionService;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository,
            BudgetRepository budgetRepository, AccountRepository accountRepository, SessionService sessionService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.accountRepository = accountRepository;
        this.sessionService = sessionService;
    }

    private void validateSession(String sessionUuid, Long expectedUserId) {
        Long tokenUserId = sessionService.getUserIdBySession(sessionUuid);
        if (tokenUserId == null || !tokenUserId.equals(expectedUserId)) {
            throw new SecurityException("Invalid or expired session token.");
        }
    }

    public TransactionResponse createTransaction(String sessionUuid, CreateTransactionRequest request) {
        validateSession(sessionUuid, request.getUserId());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));

        Budget budget = null;
        if (request.getBudgetId() != null) {
            budget = budgetRepository.findById(request.getBudgetId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Budget not found with id: " + request.getBudgetId()));
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Account not found with id: " + request.getAccountId()));
        Transaction transaction = new Transaction(
                request.getAmount(),
                request.getDescription(),
                request.getBudgetFrom(),
                request.getAccountFrom(),
                request.getCategory(),
                request.getTransactionOccurrence(),
                request.getDate(),
                user,
                budget,
                account);
        transactionRepository.save(transaction);

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getBudgetFrom(),
                transaction.getAccountFrom(),
                transaction.getCategory(),
                transaction.getTransactionOccurrence(),
                transaction.getDate(),
                transaction.getUser().getId(),
                transaction.getBudget() != null ? transaction.getBudget().getId() : null,
                transaction.getAccount().getId(),
                transaction.getDeletedAt());
    }

    public TransactionResponse getTransaction(Long id, String sessionUuid) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
        
        validateSession(sessionUuid, transaction.getUser().getId());

        Long budgetId = null;
        if (transaction.getBudget() != null) {
            budgetId = transaction.getBudget().getId();
        }
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getBudgetFrom(),
                transaction.getAccountFrom(),
                transaction.getCategory(),
                transaction.getTransactionOccurrence(),
                transaction.getDate(),
                transaction.getUser().getId(),
                budgetId,
                transaction.getAccount().getId(),
                transaction.getDeletedAt());
    }

    public TransactionResponse updateTransaction(Long id, String sessionUuid, CreateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));

        validateSession(sessionUuid, transaction.getUser().getId());

        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }
        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
        }
        if (request.getBudgetFrom() != null) {
            transaction.setBudgetFrom(request.getBudgetFrom());
        }
        if (request.getAccountFrom() != null) {
            transaction.setAccountFrom(request.getAccountFrom());
        }
        if (request.getCategory() != null) {
            transaction.setCategory(request.getCategory());
        }
        if (request.getTransactionOccurrence() != null) {
            transaction.setTransactionOccurrence(request.getTransactionOccurrence());
        }
        if (request.getDate() != null) {
            transaction.setDate(request.getDate());
        }
        if (request.getAccountId() != null) {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Account not found with id: " + request.getAccountId()));
            transaction.setAccount(account);
        }
        if (request.getBudgetId() != null) {
            Budget budget = budgetRepository.findById(request.getBudgetId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Budget not found with id: " + request.getBudgetId()));
            transaction.setBudget(budget);
            transaction.setBudgetFrom(request.getBudgetFrom());
        } else {
            transaction.setBudget(null);
            transaction.setBudgetFrom(null);
        }

        transactionRepository.save(transaction);

        Long budgetId = null;
        if (transaction.getBudget() != null) {
            budgetId = transaction.getBudget().getId();
        }
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getBudgetFrom(),
                transaction.getAccountFrom(),
                transaction.getCategory(),
                transaction.getTransactionOccurrence(),
                transaction.getDate(),
                transaction.getUser().getId(),
                budgetId,
                transaction.getAccount().getId(),
                transaction.getDeletedAt());
    }

    @Transactional
    public void softDeleteTransaction(Long id, String sessionUuid) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));

        validateSession(sessionUuid, transaction.getUser().getId());

        LocalDate deletedDate = LocalDate.now();
        transaction.setDeletedAt(deletedDate);
    }

    public List<TransactionResponse> getTransactionsByUserId(Long userId, String sessionUuid) {
        validateSession(sessionUuid, userId);

        List<Transaction> transactionList = transactionRepository.findByUserId(userId);
        List<TransactionResponse> transactionResponseList = new ArrayList<>();

        for (Transaction t : transactionList) {
            if (t.getDeletedAt() != null) {
                continue;
            }
            TransactionResponse response = new TransactionResponse(
                    t.getId(),
                    t.getAmount(),
                    t.getDescription(),
                    t.getBudgetFrom(),
                    t.getAccountFrom(),
                    t.getCategory(),
                    t.getTransactionOccurrence(),
                    t.getDate(),
                    t.getUser().getId(),
                    t.getBudget() != null ? t.getBudget().getId() : null,
                    t.getAccount().getId(),
                    t.getDeletedAt());
            transactionResponseList.add(response);
        }
        return transactionResponseList;
    }
}