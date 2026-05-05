package com.example.fashioncatalog.controller;

import com.example.fashioncatalog.dto.CartDto;
import com.example.fashioncatalog.dto.CartItemDto;
import com.example.fashioncatalog.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Validated
public class CartController {

    private final CartService cartService;

    @GetMapping("/{cartId}")
    public ResponseEntity<CartDto> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.getCartById(cartId));
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartDto> addItem(@PathVariable String cartId,
                                           @Valid @RequestBody CartItemDto itemDto) {
        return ResponseEntity.ok(cartService.addItem(cartId, itemDto));
    }

    @DeleteMapping("/{cartId}/items")
    public ResponseEntity<CartDto> removeItem(@PathVariable String cartId,
                                              @RequestParam Long productId,
                                              @RequestParam String size) {
        return ResponseEntity.ok(cartService.removeItem(cartId, productId, size));
    }

    @PostMapping("/new")
    public ResponseEntity<String> createCart() {
        return ResponseEntity.ok(cartService.createNewCartId());
    }
}
