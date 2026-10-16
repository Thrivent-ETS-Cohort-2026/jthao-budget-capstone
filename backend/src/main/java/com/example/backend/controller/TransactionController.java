package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.transaction.CreateTransactionRequest;
import com.example.backend.dto.response.transaction.TransactionResponse;
import com.example.backend.service.TransactionService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/create")
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestHeader("X-Session-Token") String sessionUuid,
            @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(sessionUuid, request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        TransactionResponse response = transactionService.getTransaction(id, sessionUuid);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid,
            @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(id, sessionUuid, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Void> softDelete(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        transactionService.softDeleteTransaction(id, sessionUuid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(
            @PathVariable Long id,
            @RequestHeader("X-Session-Token") String sessionUuid) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(id, sessionUuid));
    }
}