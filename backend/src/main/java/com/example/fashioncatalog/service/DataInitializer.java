package com.example.fashioncatalog.service;

import com.example.fashioncatalog.model.Product;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final ProductService productService;

    @PostConstruct
    public void seedData() {
        if (productService.getAllProducts().isEmpty()) {
            productService.saveProduct(Product.builder()
                    .name("Cartera Marrón Clásica")
                    .description("Bolso de mano premium con textura suave y acabado minimalista.")
                    .color("Marrón tostado")
                    .size("Única")
                    .measurements("28x18x10 cm")
                    .price(15.99)
                    .promoPrice(10.99)
                    .category("Cartera")
                    .build());
            productService.saveProduct(Product.builder()
                    .name("Cartera Negra Urbana")
                    .description("Cartera con detalles metálicos y asa ajustable para un look urbano.")
                    .color("Negro")
                    .size("Única")
                    .measurements("30x20x12 cm")
                    .price(15.99)
                    .promoPrice(10.99)
                    .category("Cartera")
                    .build());
            productService.saveProduct(Product.builder()
                    .name("Cartera Rosa Confort")
                    .description("Estilo elegante con interior acolchado y bolsillos organizadores.")
                    .color("Rosa pastel")
                    .size("Única")
                    .measurements("26x17x9 cm")
                    .price(15.99)
                    .promoPrice(10.99)
                    .category("Cartera")
                    .build());
            productService.saveProduct(Product.builder()
                    .name("Set de Camisas de Mujer")
                    .description("Pack de tres camisas modernas con corte oversize y texturas ligeras.")
                    .color("Blanco, azul y beige")
                    .size("S/M/L")
                    .measurements("Busto 90-105 cm, Largo 62 cm")
                    .price(15.99)
                    .promoPrice(10.99)
                    .category("Camisas")
                    .build());
        }
    }
}
