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
public class ProductDto {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotBlank(message = "El color es obligatorio")
    private String color;

    @NotBlank(message = "La talla es obligatoria")
    private String size;

    @NotBlank(message = "Las medidas son obligatorias")
    private String measurements;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio debe ser positivo")
    private Double price;

    @NotNull(message = "El precio en promoción es obligatorio")
    @Min(value = 0, message = "El precio en promoción debe ser positivo")
    private Double promoPrice;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;
}
