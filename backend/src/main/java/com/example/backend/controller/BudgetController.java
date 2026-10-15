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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.budget.CreateBudgetRequest;
import com.example.backend.dto.request.budget.UpdateBudgetRequest;
import com.example.backend.dto.response.budget.BudgetResponse;
import com.example.backend.service.BudgetService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/budget")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/create")
    public ResponseEntity<BudgetResponse> createBudget(@RequestBody CreateBudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @RequestBody UpdateBudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<List<BudgetResponse>> getBudgetByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetByUserId(id));
    }

    
}
