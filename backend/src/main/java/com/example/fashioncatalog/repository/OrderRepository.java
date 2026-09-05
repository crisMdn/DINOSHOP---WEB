package com.example.fashioncatalog.repository;

import com.example.fashioncatalog.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdAndClientPhone(Long id, String phone);
}