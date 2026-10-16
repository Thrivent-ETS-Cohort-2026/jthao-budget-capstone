package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.dto.request.account.CreateAccountRequest;
import com.example.backend.dto.response.account.AccountResponse;
import com.example.backend.model.Account;
import com.example.backend.model.User;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository,
            TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
        Account account = new Account(
                request.getAccountType(),
                request.getAccountName(),
                user);
        accountRepository.save(account);

        AccountResponse response = new AccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountType(),
                account.getUser().getId());
        return response;
    }

    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + id));
        return new AccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountType(),
                account.getUser().getId());
    }

    public List<AccountResponse> getAllAccountsByUserId(Long userId) {
        List<Account> accountList = accountRepository.findByUserId(userId);
        List<AccountResponse> responseList = new ArrayList<>();
        for (Account account : accountList) {
            AccountResponse response = new AccountResponse(
                    account.getId(),
                    account.getAccountName(),
                    account.getAccountType(),
                    userId);
            responseList.add(response);
        }
        return responseList;
    }

    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + id));
        boolean hasTransactions = transactionRepository.existsByAccountId(id);

        if (hasTransactions) {
            throw new IllegalStateException("Cannot delete account because it has active transactions.");
    }
        accountRepository.delete(account);
    }

}
