package com.busanit.daenggeunbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class DaenggeunBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(DaenggeunBackendApplication.class, args);
  }

}
