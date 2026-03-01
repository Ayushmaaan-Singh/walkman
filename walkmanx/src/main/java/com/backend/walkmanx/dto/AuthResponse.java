package com.backend.walkmanx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Integer userId;
    private String name;
    private String email;
    private String message;
}
