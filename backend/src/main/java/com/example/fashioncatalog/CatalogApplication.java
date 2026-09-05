package com.example.fashioncatalog;

import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CatalogApplication {
    public static void main(String[] args) {
        File envFile = new File(".env");
        if (envFile.exists()) {
            Dotenv dotenv = Dotenv.configure().load();
            dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        }
        SpringApplication.run(CatalogApplication.class, args);
    }
}
