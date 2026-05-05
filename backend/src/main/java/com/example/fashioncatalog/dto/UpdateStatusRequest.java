package com.example.fashioncatalog.dto;

import com.example.fashioncatalog.model.OrderStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private OrderStatus status;
}