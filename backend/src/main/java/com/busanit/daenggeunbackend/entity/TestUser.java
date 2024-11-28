package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
@Getter
@Setter
public class TestUser {
  @Id
  private String id;
  @Indexed(unique = true)
  private String userId;
  private String username;
}
