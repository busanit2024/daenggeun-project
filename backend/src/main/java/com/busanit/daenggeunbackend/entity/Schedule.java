package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.ScheduleDTO;
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
public class Schedule {
  @Id
  private String id;
  private String groupId; //모임 id
  private String userId; //주최(작성자) 아이디
  private String title;
  private String content;
  @CreatedDate
  private LocalDateTime createdDate;
  private List<Image> images;
  private LocalDateTime date; //일정 날짜 시간
  private int maxMember; //최대 인원수
  private boolean isClosed; //종료 여부
  private String location;
  private int views; //조회수
  private List<String> participants; //참여 유저 id
  private List<String> likeUsers; // 좋아요 누른 유저 id
  private List<String> comments; //댓글 id

  public static Schedule toEntity(ScheduleDTO dto) {
    ScheduleBuilder builder = new ScheduleBuilder()
            .id(dto.getId())
            .groupId(dto.getGroupId())
            .userId(dto.getUserId())
            .title(dto.getTitle())
            .content(dto.getContent())
            .createdDate(dto.getCreatedDate())
            .images(dto.getImages())
            .date(dto.getDate())
            .maxMember(dto.getMaxMember())
            .isClosed(dto.isClosed())
            .location(dto.getLocation())
            .views(dto.getViews())
            .participants(dto.getParticipants())
            .likeUsers(dto.getLikeUsers())
            .comments(dto.getComments());

    return builder.build();
  }

}
