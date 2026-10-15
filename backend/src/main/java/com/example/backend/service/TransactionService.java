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
import com.example.backend.types.AccountType;
import com.example.backend.types.Categories;

@Service 
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final AccountRepository accountRepository;


    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, BudgetRepository budgetRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.accountRepository = accountRepository;
    }

    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
        Budget budget = budgetRepository.findById(request.getBudgetId())
            .orElseThrow(() -> new IllegalArgumentException("Budget not found with id: " + request.getBudgetId()));
        Account account = accountRepository.findById(request.getAccountId())
            .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + request.getAccountId()));
        Transaction transaction = new Transaction(
            request.getTransactionAmount(),
            request.getDescription(),
            request.getBudgetFrom(),
            request.getAccountFrom(),
            request.getCategory(),
            request.getTransactionOccurrence(),
            request.getDate(),
            user,
            budget,
            account
        );
        transactionRepository.save(transaction);
        TransactionResponse response = new TransactionResponse(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getDescription(),
            transaction.getBudgetFrom(),
            transaction.getAccountFrom(),
            transaction.getCategory(),
            transaction.getOccurrence(),
            transaction.getDate(),
            transaction.getUser().getId(),
            transaction.getBudget().getId(),
            transaction.getAccount().getId()
        );
        return response;
    }

    public TransactionResponse getTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
        Long budgetId = null;
        if (transaction.getBudget() != null) {
            budgetId = transaction.getBudget().getId();
        }
        TransactionResponse response = new TransactionResponse(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getDescription(),
            transaction.getBudgetFrom(),
            transaction.getAccountFrom(),
            transaction.getCategory(),
            transaction.getOccurrence(),
            transaction.getDate(),
            transaction.getUser().getId(),
            budgetId,
            transaction.getAccount().getId()
        );
        return response;
    }

    public TransactionResponse updateTransaction(Long id, CreateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
        if (request.getTransactionAmount() != null) {
            transaction.setAmount(request.getTransactionAmount());
        }
        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
        }
        if (request.getBudgetFrom() != null){
            transaction.setBudgetFrom(request.getBudgetFrom());
        }
        if (request.getAccountFrom() != null) {
            transaction.setAccountFrom(request.getAccountFrom());
        }
        if (request.getCategory() != null) {
            transaction.setCategory(request.getCategory());
        }
        if (request.getTransactionOccurrence() != null) {
            transaction.setOccurrence(request.getTransactionOccurrence());
        }
        if (request.getDate() != null) {
            transaction.setDate(request.getDate());
        }
        transactionRepository.save(transaction);
        Long budgetId = null;
        if (transaction.getBudget() != null) {
            budgetId = transaction.getBudget().getId();
        }

        TransactionResponse response = new TransactionResponse(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getDescription(),
            transaction.getBudgetFrom(),
            transaction.getAccountFrom(),
            transaction.getCategory(),
            transaction.getOccurrence(),
            transaction.getDate(),
            transaction.getUser().getId(),
            budgetId,
            transaction.getAccount().getId()
        );
        return response;
    }

    @Transactional 
    public void softDeleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
            LocalDate deletedDate = LocalDate.now();
            transaction.setDeletedAt(deletedDate);
    }

    @Transactional(readOnly = true)
    public String exportTransactions(Long id){
        List<Transaction> transactionsList = transactionRepository.findByUserIdAndDeletedAtIsNullOrderByDateDesc(id);
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Amount,Description,Budget_From, Account_From,Category, Transaction_Occurrence\n");

        for (Transaction transaction : transactionsList) {
            csv.append(transaction.getDate()).append(",");
            csv.append(transaction.getAmount()).append(",");
            csv.append(escapeCsv(transaction.getDescription())).append(",");
            csv.append(transaction.getBudgetFrom()).append(",");
            csv.append(transaction.getAccountFrom()).append(",");
            csv.append(transaction.getCategory()).append("\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String value) {
    if (value == null) {
        return "";
    }
    return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    public void getFilteredTransaction(
        Long userId,
        LocalDate starDate,
        LocalDate endDate,
        Categories category,
        AccountType accountType
    ) {
        transactionRepository.findById(userId);
    }

    public List<TransactionResponse> getTransactionsByUserId(Long userId){
        List<Transaction> transactionList = transactionRepository.findbyUserId(userId);
        List<TransactionResponse> transactionResponseList = new ArrayList<>();
        for (Transaction t : transactionList){
            TransactionResponse response = new TransactionResponse(
                t.getId(),
                t.getAmount(),
                t.getDescription(),
                t.getBudgetFrom(),
                t.getAccountFrom(),
                t.getCategory(), 
                t.getOccurrence(), 
                t.getDate(),
                t.getUser().getId(),
                t.getBudget().getId(),
                t.getAccount().getId()
            );
            transactionResponseList.add(response);
        }
        return transactionResponseList;
    }
    
}
