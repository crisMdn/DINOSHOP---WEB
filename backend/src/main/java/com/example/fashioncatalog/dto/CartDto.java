package com.example.fashioncatalog.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    @NotBlank(message = "El id del carrito es obligatorio")
    private String cartId;

    @Valid
    @NotEmpty(message = "El carrito debe contener al menos un producto")
    private List<CartItemDto> items;
}
