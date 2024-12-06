package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class GroupMember {
  private String groupId;
  private String userId; // 유저 id
  private Position position; // 그룹 내 직책(멤버장, 운영진, 일반...)
  private String groupUserName; // 모임 닉네임
  private String groupNickName; // 모임 별명
  private LocalDateTime registeredDate;
  private List<String> posts; //작성한 글 id
  private List<String> comments; //작성한 댓글 id
  private List<String> assigns; //참여한 일정 id

  public enum Position {
    ADMIN, MANAGER, MEMBER
  }
}
