package com.example.fashioncatalog.config;

import com.fasterxml.jackson.databind.ObjectMapper; // Importa la clase ObjectMapper de Jackson para configurar la serialización JSON en Redis
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator; // Importa la clase BasicPolymorphicTypeValidator para configurar la validación de tipos polimórficos en Jackson
import org.springframework.context.annotation.Bean; // Importa la anotación Bean para definir un bean de configuración en Spring
import org.springframework.context.annotation.Configuration; // Importa la anotación Configuration para indicar que esta clase es una clase de configuración en Spring

import org.springframework.data.redis.connection.RedisConnectionFactory; // Importa la interfaz RedisConnectionFactory para configurar la conexión a Redis
import org.springframework.data.redis.core.RedisTemplate; // Importa la clase RedisTemplate para configurar la plantilla de Redis que se utilizará para interactuar con Redis
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer; // Importa la clase GenericJackson2JsonRedisSerializer para configurar la serialización JSON en Redis utilizando Jackson
import org.springframework.data.redis.serializer.StringRedisSerializer; // Importa la clase StringRedisSerializer para configurar la serialización de claves en Redis utilizando cadenas


@Configuration
public class RedisConfig {

    @Bean // Anotacion Bean que indica que este metodo devuelve un bean para la configuracion de Redis
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        ObjectMapper mapper = new ObjectMapper(); //crea una instancia de ObjectMapper para configurar la serialización JSON en Redis
        mapper.activateDefaultTyping(BasicPolymorphicTypeValidator.builder()
                .allowIfSubType(Object.class)
                .build(), ObjectMapper.DefaultTyping.EVERYTHING);

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(mapper);

        // Configura la plantilla de Redis para usar el serializador JSON para las claves y valores, y luego devuelve la plantilla configurada
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        template.afterPropertiesSet();
        return template;
    }
}
