package com.example.backend.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.transaction.CreateTransactionRequest;
import com.example.backend.dto.response.transaction.TransactionResponse;
import com.example.backend.dto.response.transaction.TransactionResponsePagination;
import com.example.backend.service.TransactionService;
import com.example.backend.types.AccountType;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/create")
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping ("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id) {
        TransactionResponse response = transactionService.getTransaction(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id, @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        transactionService.softDeleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    //pageable transaction
    // @GetMapping
    // public ResponseEntity<Page<TransactionResponsePagination>> getTransactions(
    //     @RequestParam(required = false) LocalDate startDate,
    //     @RequestParam(required = false) LocalDate endDate,
    //     @RequestParam(required = false) String category,
    //     @RequestParam(required = false) AccountType accountType,
    //     Pageable pageable
    // ) {
    //     transactionService.getFilteredTransaction(userId, startDate, endDate, category, accountType);



    // }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(Long userId){
        byte[] csv = transactionService.exportTransactions(userId)
        .getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"transactions.csv\""
        )
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(csv);
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(id));
    }

}
