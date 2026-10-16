package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.account.CreateAccountRequest;
import com.example.backend.dto.request.account.UpdateAccountRequest;
import com.example.backend.dto.response.account.AccountResponse;
import com.example.backend.service.AccountService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/account")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public ResponseEntity<AccountResponse> createAccount(
            @RequestHeader("X-Session-Token") String sessionUuid,
            @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(sessionUuid, request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        return ResponseEntity.ok(accountService.getAccountById(id, sessionUuid));
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        return ResponseEntity.ok(accountService.getAllAccountsByUserId(id, sessionUuid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        accountService.deleteAccount(id, sessionUuid);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid,
            @RequestBody UpdateAccountRequest request) {
        return ResponseEntity.ok(accountService.updateAccount(id, sessionUuid, request));
    }
}