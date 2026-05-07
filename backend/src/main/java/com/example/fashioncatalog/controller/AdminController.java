package com.example.fashioncatalog.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", "admin_" + System.currentTimeMillis()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Credenciales inválidas"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("admin_")) {
            return ResponseEntity.ok(Map.of("valid", true));
        }
        return ResponseEntity.status(401).body(Map.of("valid", false));
    }
}