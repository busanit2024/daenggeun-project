package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "group")
@Getter
@Setter
public class Group {
  @Id
  private String id;
  private String name;
  private List<Image> images;
  private String description;
  private String Location;
  private String category;
  @CreatedDate
  private LocalDateTime createdDate;
  private Boolean requireVerification; // 본인인증 필요 여부
  private String ageRange; // 나이제한
  private int maxPeople; //최대 인원수
  private List<String> favoriteUsers; // 관심 등록 유저 id
  private List<Member> members; //멤버 클래스 리스트
  private List<String> posts; //게시글 id
  private List<String> schedules; // 일정 id

}

@Getter
@Setter
class Member {
  private String memberId;
  private String position;
  private String groupUserName; // 모임 닉네임
  private String groupNickName; // 모임 별명
  private LocalDateTime registeredDate;
  private List<String> posts; //작성한 글 id
  private List<String> comments; //작성한 댓글 id
  private List<String> assigns; //참여한 일정 id
}



