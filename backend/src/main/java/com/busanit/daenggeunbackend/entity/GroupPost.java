package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.Image;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Getter
@Setter
public class GroupPost {
  @Id
  private String id;
  private String GroupId; //모임 id
  private String userId; //작성자 id
  private String content;
  private String board; //게시판 종류
  @CreatedDate
  private LocalDateTime createdDate;
  private boolean isPrivate;
  private int view; // 조회수
  private List<Image> images;
  private List<String> likeUsers; //공감 누른 유저 id
  private List<String> comments; //댓글 id
}
