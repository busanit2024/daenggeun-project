package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "group_member")
@Getter
@Setter
public class GroupMember {
  @Id
  private String id;
  private String groupId;
  private String userId; // 유저 id
  private String position; // 그룹 내 직책(멤버장, 운영진, 일반...)
  private String groupUserName; // 모임 닉네임
  private String groupNickName; // 모임 별명
  @CreatedDate
  private LocalDateTime registeredDate;
  private List<String> posts; //작성한 글 id
  private List<String> comments; //작성한 댓글 id
  private List<String> assigns; //참여한 일정 id
}
