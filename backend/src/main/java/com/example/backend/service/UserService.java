package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.dto.request.user.CreateUserRequest;
import com.example.backend.dto.request.user.LoginRequest;
import com.example.backend.dto.response.user.UserResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SessionService sessionService;

    public UserService(UserRepository userRepository, SessionService sessionService) {
        this.userRepository = userRepository;
        this.sessionService = sessionService;
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber());
        userRepository.save(user);

        String sessionUuid = sessionService.createSession(user.getId());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getIsActive(),
                sessionUuid);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getIsActive(),
                null);
    }

    public UserResponse getUserByEmailAndPassword(LoginRequest request) {
        User user = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new EntityNotFoundException(
                        "User not found with email: " + request.getEmail() + " and password combination."));

        String sessionUuid = sessionService.createSession(user.getId());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getIsActive(),
                sessionUuid);
    }

    public UserResponse updateUser(Long userId, String sessionUuid, CreateUserRequest request) {
        Long tokenUserId = sessionService.getUserIdBySession(sessionUuid);
        if (tokenUserId == null || !tokenUserId.equals(userId)) {
            throw new SecurityException("Invalid or expired session token.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(request.getPassword());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        userRepository.save(user);

        return new UserResponse(
                userId,
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getIsActive(),
                sessionUuid);
    }
}