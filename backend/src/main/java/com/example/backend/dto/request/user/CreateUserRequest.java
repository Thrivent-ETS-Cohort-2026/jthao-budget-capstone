package com.example.backend.dto.request.user;

public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private Boolean isActive;

    public CreateUserRequest() {
    }

    // public CreateUserRequest(String firstName, String lastName, String email, String password, String phoneNumber, Boolean isActive) {
    //     this.firstName = firstName;
    //     this.lastName = lastName;
    //     this.email = email;
    //     this.password = password;
    //     this.phoneNumber = phoneNumber;
    //     this.isActive = isActive;
    // }

    // Getters and setters

    public String getFirstName() {
        return firstName;
    }


    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }


    public String getPhoneNumber() {
        return phoneNumber;
    }

    
     public Boolean getIsActive() {
        return isActive;
     }
}
