package com.example.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.dto.request.user.CreateUserRequest;
import com.example.backend.dto.response.user.UserResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service 
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
            request.getPhoneNumber()
        );
        System.out.println("Creating user: " + user);
        userRepository.save(user);
        UserResponse response = new UserResponse(
            user.getId(), 
            user.getFirstName(), 
            user.getLastName(), 
            user.getEmail(), 
            user.getPhoneNumber(), 
            user.getIsActive()
        );
        return response;
    }

    public UserResponse getUserById(Long id) {
        if (userRepository.findById(id).isPresent()) {
            User user = userRepository.findById(id).get();
            return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getIsActive()
            );
        } else {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
    }
}
