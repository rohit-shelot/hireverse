package com.campus.backend.dto;

import com.campus.backend.model.Role;

public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private Role role;

    public AuthResponse(String token, String userId, String name, Role role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    // Getters
    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public Role getRole() { return role; }
}
