package com.example.fashioncatalog.controller; //

import org.springframework.beans.factory.annotation.Value; //permite inyectar valores de propiedades en campos de clase
import org.springframework.http.ResponseEntity; //permite construir respuestas HTTP con un código de estado y un cuerpo
import org.springframework.web.bind.annotation.*; //permite definir controladores REST y mapear solicitudes HTTP a métodos de clase
import java.util.Map;  //permite trabajar con colecciones de pares clave-valor


@RestController
@RequestMapping("/api/admin") //ruta de la API para el controlador de administración
public class AdminController {

    @Value("${app.admin.username:admin}") // la etiqueta @value permite inyectar valores de propiedades en campos de clase. En este caso, se inyecta el valor de la propiedad app.admin.username, y si no está definida, se asigna el valor predeterminado "admin".
    private String adminUsername;

    @Value("${app.admin.password:}") // Valor predeterminado para la contraseña del administrador (vacío por defecto)
    private String adminPassword;

    @PostMapping("/login") // metodo para manejar la solicitud de inicio de sesión del administrador
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", "admin_" + System.currentTimeMillis()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Credenciales inválidas"));
    }

    @GetMapping("/verify") // metodo para verificar la validez del token de autenticación del administrador
    public ResponseEntity<?> verify(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("admin_")) {
            return ResponseEntity.ok(Map.of("valid", true));
        }
        return ResponseEntity.status(401).body(Map.of("valid", false));
    }
}