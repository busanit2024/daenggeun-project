package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.GroupPostDTO;
import com.busanit.daenggeunbackend.domain.Image;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.*;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Getter
@Setter
@Builder
public class GroupPost {
  @Id
  private String id;
  private String groupId; //모임 id
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

  public static GroupPost toEntity(GroupPostDTO groupPostDTO) {
    GroupPostBuilder builder = GroupPost.builder();
    if (groupPostDTO.getId() != null) {
      builder.id(groupPostDTO.getId());
    }

    builder.createdDate(groupPostDTO.getCreatedDate());
    builder.groupId(groupPostDTO.getGroupId());
    builder.userId(groupPostDTO.getUserId());
    builder.content(groupPostDTO.getContent());
    builder.board(groupPostDTO.getBoard());
    builder.isPrivate(groupPostDTO.isPrivate());
    builder.view(groupPostDTO.getView());
    builder.images(groupPostDTO.getImages());
    builder.likeUsers(groupPostDTO.getLikeUsers());
    builder.comments(groupPostDTO.getComments());
    return builder.build();
  }
}
