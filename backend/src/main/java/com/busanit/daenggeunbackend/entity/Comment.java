package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.constant.CommentType;
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
public class Comment {
  @Id
  private String id;
  private String postId; //게시글 id
  private String userId;
  @CreatedDate
  private LocalDateTime createdDate;
  private String content;
  private List<String> likeUsers; //공감 누른 유저 id
  private List<Image> images;
  private CommentType commentType; //댓글인지 답글인지
  private List<String> replies; //답글 있으면 답글 id 리스트
}
