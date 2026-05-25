package com.example.fashioncatalog.repository;

import com.example.fashioncatalog.model.Product; // Importa la clase Product que representa la entidad de producto en la base de datos, lo que permite definir el repositorio para realizar operaciones CRUD en la tabla de productos utilizando JPA
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Anotación de Spring que indica que esta interfaz es un repositorio, lo que permite que Spring la detecte y la configure automáticamente para realizar operaciones de acceso a datos en la base de datos utilizando JPA
public interface ProductRepository extends JpaRepository<Product, Long> {
}
