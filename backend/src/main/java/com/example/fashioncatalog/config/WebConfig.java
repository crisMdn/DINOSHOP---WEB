package com.example.fashioncatalog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration; //Configura las políticas de CORS para permitir solicitudes desde dominios específicos, métodos HTTP y encabezados, y luego registra esta configuración para todas las rutas de la aplicación utilizando un CorsFilter
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; //Importa la clase UrlBasedCorsConfigurationSource para registrar la configuración de CORS para todas las rutas de la aplicación
import org.springframework.web.filter.CorsFilter; //Importa la clase CorsFilter para aplicar la configuración de CORS a las solicitudes entrantes

import java.util.List; //Importa la clase List para utilizarla en la configuración de CORS para especificar los orígenes permitidos, métodos HTTP y encabezados

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {  //Define un bean de CorsFilter que configura las políticas de CORS para permitir solicitudes desde dominios específicos, métodos HTTP y encabezados, y luego registra esta configuración para todas las rutas de la aplicación utilizando un CorsFilter
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "https://dinoshop-web.onrender.com", "https://dinoshop-web-fp3q.onrender.com")); // Especifica los orígenes permitidos sitios web 
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // Especifica los métodos HTTP permitidos para las solicitudes CORS
        config.setAllowedHeaders(List.of("*")); // Especifica los encabezados permitidos en las solicitudes CORS, en este caso se permiten todos los encabezados utilizando "*"
        config.setAllowCredentials(true); // Permite el envío de cookies y credenciales en las solicitudes CORS, lo que es necesario para la autenticación y el manejo de sesiones en aplicaciones web

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
