package com.example.fashioncatalog.service;

import com.example.fashioncatalog.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    @Value("${app.notification.whatsapp-token:}")
    private String whatsappToken;

    @Value("${app.notification.whatsapp-phone:}")
    private String whatsappPhone;

    @Value("${app.notification.admin-email:}")
    private String adminEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendNewOrderNotification(OrderResponse order) {
        try {
            String adminMessage = buildAdminMessage(order);
            sendWhatsAppToAdmin(adminMessage);
            log.info("Notificación de nueva orden {} enviada", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Error enviando notificación: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderStatusNotification(OrderResponse order) {
        try {
            String customerMessage = buildCustomerStatusMessage(order);
            if (order.getClientPhone() != null) {
                sendWhatsApp(order.getClientPhone(), customerMessage);
            }
            log.info("Notificación de estado {} enviada a {}", order.getOrderNumber(), order.getClientPhone());
        } catch (Exception e) {
            log.error("Error enviando notificación de estado: {}", e.getMessage());
        }
    }

    private void sendWhatsAppToAdmin(String message) throws Exception {
        if (whatsappToken == null || whatsappToken.isEmpty() || whatsappPhone == null || whatsappPhone.isEmpty()) {
            log.warn("WhatsApp no configurado, simulando envío: {}", message);
            return;
        }
        sendWhatsApp(whatsappPhone, message);
    }

    private void sendWhatsApp(String phone, String message) throws Exception {
        if (whatsappToken == null || whatsappToken.isEmpty()) {
            log.warn("WhatsApp API no configurado");
            return;
        }
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        String url = "https://api.callmebot.com/whatsapp.php?phone=" + phone + "&text=" + encodedMessage + "&apikey=" + whatsappToken;
        restTemplate.getForObject(url, String.class);
    }

    private String buildAdminMessage(OrderResponse order) {
        StringBuilder sb = new StringBuilder();
        sb.append("🛍️ *Nueva Orden* ").append(order.getOrderNumber()).append("\n");
        sb.append("Cliente: ").append(order.getClientName()).append("\n");
        sb.append("Teléfono: ").append(order.getClientPhone()).append("\n");
        sb.append("Email: ").append(order.getClientEmail()).append("\n");
        sb.append("Total: $").append(String.format("%.2f", order.getTotal())).append("\n");
        sb.append("Items:\n");
        for (var item : order.getItems()) {
            sb.append("- ").append(item.getQuantity()).append("x ").append(item.getProductName());
            sb.append(" (").append(item.getSize()).append(")\n");
        }
        sb.append("\nTotal: $").append(String.format("%.2f", order.getTotal()));
        return sb.toString();
    }

    private String buildCustomerStatusMessage(OrderResponse order) {
        String statusText = switch (order.getStatus()) {
            case PAID -> "✅ Pagado";
            case SHIPPED -> "📦 Enviado";
            case DELIVERED -> "✅ Entregado";
            case CANCELLED -> "❌ Cancelado";
            default -> "⏳ Pendiente";
        };
        return "Hola " + order.getClientName() + "! Tu orden " + order.getOrderNumber() + " ahora está: " + statusText + ". Gracias por tu compra en DinoShop!";
    }
}