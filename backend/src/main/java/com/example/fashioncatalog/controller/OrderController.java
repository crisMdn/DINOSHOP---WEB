package com.example.fashioncatalog.controller;

import com.example.fashioncatalog.dto.*;
import com.example.fashioncatalog.model.OrderStatus;
import com.example.fashioncatalog.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }

    @PatchMapping("/{id}/confirm-delivery")
    public ResponseEntity<OrderResponse> confirmDelivery(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.confirmDelivery(id));
    }

    @PatchMapping("/{id}/next-delivery")
    public ResponseEntity<OrderResponse> updateNextDeliveryDate(
            @PathVariable Long id,
            @RequestBody UpdateNextDeliveryRequest request) {
        return ResponseEntity.ok(orderService.updateNextDeliveryDate(id, request.getNextDeliveryDate()));
    }
}