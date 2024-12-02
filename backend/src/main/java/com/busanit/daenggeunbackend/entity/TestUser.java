package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
public class TestUser {
  //@Id 어노테이션 지정하면 문서 id를 자동으로 생성해주기 때문에, 유저 아이디 같은 사용자 지정 아이디를 따로 만드는게 낫다고 하네요
  @Id
  private String id;

  //@Indexed 어노테이션으로 유니크 제약조건 걸 수 있는 것 확인함!
  @Indexed(unique = true)
  private String userId;
  private UserName username;

  public void setUsername(String firstName, String lastName) {
    UserName userName = new UserName();
    userName.setFirstName(firstName);
    userName.setLastName(lastName);
    this.username = userName;
  }
}

@Setter
@Getter
class UserName {
  private String firstName;
  private String lastName;
}
