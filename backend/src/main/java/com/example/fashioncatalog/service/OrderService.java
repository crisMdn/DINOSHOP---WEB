package com.example.fashioncatalog.service;

import com.example.fashioncatalog.dto.*;
import com.example.fashioncatalog.exception.ResourceNotFoundException;
import com.example.fashioncatalog.model.*;
import com.example.fashioncatalog.repository.OrderRepository;
import com.example.fashioncatalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        PaymentStatus paymentStatus;
        if ("contraentrega".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentStatus = PaymentStatus.CONTRADELIVERY;
        } else {
            paymentStatus = PaymentStatus.PENDING;
        }

        DeliveryType deliveryType = "DELIVERY".equalsIgnoreCase(request.getDeliveryType()) 
                ? DeliveryType.DELIVERY 
                : DeliveryType.PICKUP;

        Order order = Order.builder()
                .clientName(request.getClientName())
                .clientPhone(request.getClientPhone())
                .clientEmail(request.getClientEmail())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .deliveryType(deliveryType)
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PENDING)
                .build();

        double total = 0.0;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + itemReq.getProductId()));

            double price = product.getPromoPrice() > 0 ? product.getPromoPrice() : product.getPrice();
            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .size(itemReq.getSize())
                    .priceAtPurchase(price)
                    .build();

            order.addItem(item);
            total += item.getQuantity() * item.getPriceAtPurchase();
        }

        order.setTotal(total);
        Order saved = orderRepository.save(order);

        OrderResponse response = toResponse(saved);
        notificationService.sendNewOrderNotification(response);

        return response;
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + id));
        return toResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + id));
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        OrderResponse response = toResponse(saved);
        notificationService.sendOrderStatusNotification(response);
        return response;
    }

    @Transactional
    public OrderResponse confirmDelivery(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + id));
        
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.DELIVERED);
        
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse updateNextDeliveryDate(Long id, LocalDateTime nextDate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + id));
        
        order.setNextDeliveryDate(nextDate);
        
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber("ORD-" + String.format("%04d", order.getId()));
        response.setClientName(order.getClientName());
        response.setClientPhone(order.getClientPhone());
        response.setClientEmail(order.getClientEmail());
        response.setTotal(order.getTotal());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentReference(order.getPaymentReference());
        response.setDeliveryType(order.getDeliveryType());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setDeliveryCost(order.getDeliveryCost());
        response.setClientConfirmedAt(order.getClientConfirmedAt());
        response.setNextDeliveryDate(order.getNextDeliveryDate());
        response.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> {
                    OrderItemResponse itemResp = new OrderItemResponse();
                    itemResp.setProductId(item.getProduct().getId());
                    itemResp.setProductName(item.getProduct().getName());
                    itemResp.setQuantity(item.getQuantity());
                    itemResp.setSize(item.getSize());
                    itemResp.setPrice(item.getPriceAtPurchase());
                    return itemResp;
                })
                .collect(Collectors.toList());
        response.setItems(items);

        return response;
    }
}