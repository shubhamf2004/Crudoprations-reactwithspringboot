package com.demo.dto;

public class LoginResponse {
    private Long id;
    private String token;
    private String email;
    private String username;
    private String role;

    public LoginResponse(Long id, String token, String email, String username, String role) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.username = username;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
