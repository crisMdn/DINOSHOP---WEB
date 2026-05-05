package com.example.fashioncatalog.service;

import com.example.fashioncatalog.dto.CartDto;
import com.example.fashioncatalog.dto.CartItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String CART_KEY_PREFIX = "cart:";
    private final RedisTemplate<String, Object> redisTemplate;

    public CartDto getCartById(String cartId) {
        Object cartObject = redisTemplate.opsForValue().get(CART_KEY_PREFIX + cartId);
        if (cartObject instanceof CartDto cartDto) {
            return cartDto;
        }
        return CartDto.builder()
                .cartId(cartId)
                .items(new ArrayList<>())
                .build();
    }

    public CartDto saveCart(CartDto cartDto) {
        redisTemplate.opsForValue().set(CART_KEY_PREFIX + cartDto.getCartId(), cartDto);
        return cartDto;
    }

    public CartDto addItem(String cartId, CartItemDto itemDto) {
        CartDto cart = getCartById(cartId);
        List<CartItemDto> items = new ArrayList<>(cart.getItems());
        items.removeIf(existing -> existing.getProductId().equals(itemDto.getProductId()) && existing.getSize().equals(itemDto.getSize()));
        items.add(itemDto);
        cart.setItems(items);
        return saveCart(cart);
    }

    public CartDto removeItem(String cartId, Long productId, String size) {
        CartDto cart = getCartById(cartId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId) && item.getSize().equals(size));
        return saveCart(cart);
    }

    public String createNewCartId() {
        return UUID.randomUUID().toString();
    }
}
