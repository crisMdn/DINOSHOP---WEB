package com.example.fashioncatalog.service;

import com.example.fashioncatalog.dto.ProductDto;
import com.example.fashioncatalog.exception.ResourceNotFoundException;
import com.example.fashioncatalog.model.Product;
import com.example.fashioncatalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; //Importa la clase Collectors para utilizarla en el método getAllProducts() para convertir la lista de productos obtenida de la base de datos en una lista de ProductDto utilizando el método mapToDto() para cada producto, lo que permite separar la lógica de negocio de la lógica de presentación y mejorar la seguridad al no exponer directamente la entidad Product al frontend

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository; //Inyecta el repositorio de productos utilizando la anotación @RequiredArgsConstructor de Lombok, lo que permite acceder a los métodos de acceso a datos para realizar operaciones CRUD en la base de datos


    // Define los métodos del servicio para obtener todos los productos, obtener un producto por ID, guardar un nuevo producto, actualizar un producto existente y eliminar un producto, utilizando el repositorio de productos para realizar las operaciones de acceso a datos y el método mapToDto() para convertir las entidades Product en objetos ProductDto que se pueden enviar al frontend
    public List<ProductDto> getAllProducts() { //creo un metodo getAllproducts que devuelve una lista de productosDTO, este metodo utiliza el repositorio de productos para obtener todos los productos de la bs, 
        return productRepository.findAll().stream() //findAll() devuelve una lista de productos, luego lo paso a stream como una banda transportadora para poder aplicar operaciones de transformacion.
                .map(this::mapToDto) //map() a medida que cada producto pasa por stream map le aplica el metodo mapToDto() para convertirlo en un ProductDto, lo que permite separar la lógica de negocio de la lógica de presentación y mejorar la seguridad al no exponer directamente la entidad Product al frontend
                .collect(Collectors.toList()); //al final de la cinta transportadora de stream que fue transformando lo datos a DTO por map; collect toma todos los nuevos DTOs y los junta en una nueva lista de ProductDto lista que es lo que devuelve el metodo getAllProducts() al frontend
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id)); //utiliza el repositorio de productos para buscar un producto por su ID, si lo encuentra lo convierte a ProductDto utilizando el método mapToDto() y lo devuelve, si no lo encuentra lanza una excepción ResourceNotFoundException con un mensaje indicando que el producto no fue encontrado
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product); //utiliza el repositorio de productos para guardar un nuevo producto en la base de datos, lo que permite agregar nuevos productos al catálogo de moda
    }

    public ProductDto mapToDto(Product product) {
        return ProductDto.builder() //patron de diseño build para crear un nuevo objeto (productoDto) a partir de un producto, asignando cada campo del producto al campo correspondiente. 
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
