package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.Comment;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CommentDTO {

    private String id;
    private String postId; //게시글 id
    private String userId;
    private Comment.BoardType boardType;
    private LocalDateTime createdDate;
    private String content;
    private List<String> likeUsers; //공감 누른 유저 id
    private List<Image> images;
    private Comment.CommentType commentType; //댓글인지 답글인지
    private List<String> replies; //답글 있으면 답글 id 리스트

  public static CommentDTO toDTO(Comment comment) {
    CommentDTOBuilder builder = CommentDTO.builder()
            .id(comment.getId())
            .postId(comment.getPostId())
            .userId(comment.getUserId())
            .boardType(comment.getBoardType())
            .createdDate(comment.getCreatedDate())
            .content(comment.getContent())
            .likeUsers(comment.getLikeUsers())
            .images(comment.getImages())
            .commentType(comment.getCommentType())
            .replies(comment.getReplies());

    return builder.build();
  }

  public static List<CommentDTO> toDTO(List<Comment> comments) {
    return comments.stream().map(CommentDTO::toDTO).toList();
  }
}
