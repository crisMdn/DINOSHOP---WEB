package com.example.fashioncatalog.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Anotación de JPA que indica que esta clase es una entidad persistente que se mapeará a una tabla en la base de datos, lo que permite que los objetos de esta clase se almacenen y recuperen de la base de datos utilizando JPA
@Data // Anotación de Lombok que genera automáticamente los métodos getters, setters, equals, hashCode y toString para la clase Product, lo que simplifica el código y mejora la legibilidad al evitar la necesidad de escribir manualmente estos métodos
@Builder // Anotación de Lombok que genera un constructor con el patrón de diseño Builder, lo que permite crear objetos de la clase Product de manera más flexible y legible utilizando un enfoque fluido
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String color;
    private String size;
    private String measurements;
    private double price;
    private double promoPrice;
    private String category;
    private String imageUrl;
    private Integer stock;
}
