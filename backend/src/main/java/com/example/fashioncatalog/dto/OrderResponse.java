package com.example.fashioncatalog.dto;

import com.example.fashioncatalog.model.DeliveryType;
import com.example.fashioncatalog.model.OrderStatus;
import com.example.fashioncatalog.model.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String clientName;
    private String clientPhone;
    private String clientEmail;
    private Double total;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String paymentReference;
    private DeliveryType deliveryType;
    private String deliveryAddress;
    private Double deliveryCost;
    private LocalDateTime clientConfirmedAt;
    private LocalDateTime nextDeliveryDate;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}