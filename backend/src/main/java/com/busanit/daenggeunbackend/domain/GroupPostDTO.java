package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.GroupPost;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class GroupPostDTO {
  private String id;
  private String groupId; //모임 id
  private String userId; //작성자 id
  private String content;
  private String board; //게시판 종류
  private LocalDateTime createdDate;
  private boolean isPrivate;
  private int view; // 조회수
  private List<Image> images;
  private List<String> likeUsers; //공감 누른 유저 id
  private List<String> comments; //댓글 id

  public static GroupPostDTO toDTO(GroupPost groupPost) {
    GroupPostDTOBuilder builder = GroupPostDTO.builder();
    builder.id(groupPost.getId())
            .groupId(groupPost.getGroupId())
            .userId(groupPost.getUserId())
            .content(groupPost.getContent())
            .board(groupPost.getBoard())
            .createdDate(groupPost.getCreatedDate())
            .isPrivate(groupPost.isPrivate())
            .view(groupPost.getView())
            .images(groupPost.getImages())
            .likeUsers(groupPost.getLikeUsers())
            .comments(groupPost.getComments());

    return builder.build();
  }

  public static Slice<GroupPostDTO> toDTO(Slice<GroupPost> groupPosts) {
    return groupPosts.map(GroupPostDTO::toDTO);
  }

}
