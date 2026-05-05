package com.example.fashioncatalog.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private String clientName;
    private String clientPhone;
    private String clientEmail;
    private String paymentMethod;
    private String deliveryType;
    private String deliveryAddress;
    private List<OrderItemRequest> items;
}