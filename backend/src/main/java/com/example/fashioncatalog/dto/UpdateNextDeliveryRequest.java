package com.example.fashioncatalog.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateNextDeliveryRequest {
    private LocalDateTime nextDeliveryDate;
}