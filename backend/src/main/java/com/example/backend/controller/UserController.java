package com.example.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.backend.dto.request.user.CreateUserRequest;
import com.example.backend.dto.request.user.LoginRequest;
import com.example.backend.dto.response.user.UserResponse;
import com.example.backend.service.UserService;


@CrossOrigin (origins = "http://localhost:3000")
@RestController 
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
    //     return ResponseEntity.ok(userService.getUserById(id));
    // }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> getUserByEmailAndPassword(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.getUserByEmailAndPassword(request));
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<UserResponse> updateUser(
        @PathVariable Long id, 
        @RequestHeader("X-Session-Token") String sessionUuid,
        @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, sessionUuid, request));
    }
}
