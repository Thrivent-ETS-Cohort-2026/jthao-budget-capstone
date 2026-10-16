package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.dto.request.account.CreateAccountRequest;
import com.example.backend.dto.request.account.UpdateAccountRequest;
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
    private final SessionService sessionService;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository,
            TransactionRepository transactionRepository, SessionService sessionService) {
        this.accountRepository = accountRepository;
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

    public AccountResponse createAccount(String sessionUuid, CreateAccountRequest request) {
        validateSession(sessionUuid, request.getUserId());

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

    public AccountResponse getAccountById(Long id, String sessionUuid) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + id));

        validateSession(sessionUuid, account.getUser().getId());

        return new AccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountType(),
                account.getUser().getId());
    }

    public List<AccountResponse> getAllAccountsByUserId(Long userId, String sessionUuid) {
        validateSession(sessionUuid, userId);

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

    public void deleteAccount(Long id, String sessionUuid) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + id));

        validateSession(sessionUuid, account.getUser().getId());

        boolean hasTransactions = transactionRepository.existsByAccountId(id);

        if (hasTransactions) {
            throw new IllegalStateException("Cannot delete account because it has active transactions.");
        }
        accountRepository.delete(account);
    }

    public AccountResponse updateAccount(Long id, String sessionUuid, UpdateAccountRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + id));

        validateSession(sessionUuid, account.getUser().getId());

        if (request.getAccountName() != null) {
            account.setAccountName(request.getAccountName());
        }
        if (request.getAccountType() != null) {
            account.setAccountType(request.getAccountType());
        }
        accountRepository.save(account);
        AccountResponse response = new AccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountType(),
                account.getUser().getId());

        return response;
    }
}