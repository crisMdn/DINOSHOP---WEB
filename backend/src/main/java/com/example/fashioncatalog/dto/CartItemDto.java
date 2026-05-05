package com.example.fashioncatalog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    @NotNull(message = "El id del producto es obligatorio")
    private Long productId;

    @NotBlank(message = "La talla seleccionada es obligatoria")
    private String size;

    @Min(value = 1, message = "La cantidad mínima es 1")
    private int quantity;
}
