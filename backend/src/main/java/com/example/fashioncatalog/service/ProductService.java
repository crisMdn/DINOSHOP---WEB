package com.example.fashioncatalog.service;

import com.example.fashioncatalog.dto.ProductDto;
import com.example.fashioncatalog.exception.ResourceNotFoundException;
import com.example.fashioncatalog.model.Product;
import com.example.fashioncatalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .color(product.getColor())
                .size(product.getSize())
                .measurements(product.getMeasurements())
                .price(product.getPrice())
                .promoPrice(product.getPromoPrice())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .build();
    }

    public ProductDto updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
        
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setColor(product.getColor());
        existing.setSize(product.getSize());
        existing.setMeasurements(product.getMeasurements());
        existing.setPrice(product.getPrice());
        existing.setPromoPrice(product.getPromoPrice());
        existing.setCategory(product.getCategory());
        existing.setImageUrl(product.getImageUrl());
        existing.setStock(product.getStock());
        
        return mapToDto(productRepository.save(existing));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado: " + id);
        }
        productRepository.deleteById(id);
    }
}
