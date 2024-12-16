package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.CommentDTO;
import com.busanit.daenggeunbackend.domain.Image;
import lombok.Builder;
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
@Builder
public class Comment {
  @Id
  private String id;
  private String postId; //게시글 id
  private String userId;
  private BoardType boardType;
  @CreatedDate
  private LocalDateTime createdDate;
  private String content;
  private List<String> likeUsers; //공감 누른 유저 id
  private List<Image> images;
  private CommentType commentType; //댓글인지 답글인지
  private List<String> replies; //답글 있으면 답글 id 리스트

  public enum CommentType {
    COMMENT, REPLY //댓글, 답글
  }

  public enum BoardType {
    COMMUNITY, GROUP_POST, SCHEDULE
  }

  public static Comment toEntity(CommentDTO commentDTO) {
    CommentBuilder builder = Comment.builder()
            .id(commentDTO.getId())
            .postId(commentDTO.getPostId())
            .userId(commentDTO.getUserId())
            .boardType(commentDTO.getBoardType())
            .createdDate(commentDTO.getCreatedDate())
            .content(commentDTO.getContent())
            .likeUsers(commentDTO.getLikeUsers())
            .images(commentDTO.getImages())
            .commentType(commentDTO.getCommentType())
            .replies(commentDTO.getReplies());

    return builder.build();
  }

}
