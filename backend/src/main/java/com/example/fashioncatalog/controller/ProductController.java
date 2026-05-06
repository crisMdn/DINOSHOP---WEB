package com.example.fashioncatalog.controller;

import com.example.fashioncatalog.dto.ProductDto;
import com.example.fashioncatalog.model.Product;
import com.example.fashioncatalog.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> listProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .color(productDto.getColor())
                .size(productDto.getSize())
                .measurements(productDto.getMeasurements())
                .price(productDto.getPrice())
                .promoPrice(productDto.getPromoPrice())
                .category(productDto.getCategory())
                .imageUrl(productDto.getImageUrl())
                .stock(productDto.getStock())
                .build();
        return ResponseEntity.ok(productService.mapToDto(productService.saveProduct(product)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .color(productDto.getColor())
                .size(productDto.getSize())
                .measurements(productDto.getMeasurements())
                .price(productDto.getPrice())
                .promoPrice(productDto.getPromoPrice())
                .category(productDto.getCategory())
                .imageUrl(productDto.getImageUrl())
                .stock(productDto.getStock())
                .build();
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
