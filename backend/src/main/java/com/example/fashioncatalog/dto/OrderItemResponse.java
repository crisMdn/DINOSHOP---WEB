package com.example.fashioncatalog.dto;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private Integer quantity;
    private String size;
    private Double price;
}