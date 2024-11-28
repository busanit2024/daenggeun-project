package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "schedule")
@Getter
@Setter
public class Schedule {
  @Id
  private String id;
  private String userId; //주최(작성자) 아이디
  private String title;
  private String content;
  @CreatedDate
  private LocalDateTime createdTime;
  private List<Image> images;
  private LocalDateTime date; //일정 날짜 시간
  private int maxPeople; //최대 인원수
  private boolean isClosed; //종료 여부
  private String location;
  private int views; //조회수
  private List<String> participants; //참여 유저 id
  private List<String> likeUsers; // 좋아요 누른 유저 id
  private List<String> comments; //댓글 id

}
