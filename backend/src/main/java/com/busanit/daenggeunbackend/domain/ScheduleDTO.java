package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.Schedule;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class ScheduleDTO {
  private String id;
  private String groupId; //모임 id
  private String userId; //주최(작성자) 아이디
  private String title;
  private String content;
  private LocalDateTime createdDate;
  private List<Image> images;
  private LocalDateTime date; //일정 날짜 시간
  private int maxMember; //최대 인원수
  private boolean closed; //종료 여부
  private String location;
  private int views; //조회수
  private List<String> participants; //참여 유저 id
  private List<String> likeUsers; // 좋아요 누른 유저 id
  private List<String> comments; //댓글 id

  public static ScheduleDTO toDTO(Schedule schedule) {
    ScheduleDTOBuilder builder = ScheduleDTO.builder()
            .id(schedule.getId())
            .groupId(schedule.getGroupId())
            .userId(schedule.getUserId())
            .title(schedule.getTitle())
            .content(schedule.getContent())
            .createdDate(schedule.getCreatedDate())
            .images(schedule.getImages())
            .date(schedule.getDate())
            .maxMember(schedule.getMaxMember())
            .closed(schedule.isClosed())
            .location(schedule.getLocation())
            .views(schedule.getViews())
            .participants(schedule.getParticipants())
            .likeUsers(schedule.getLikeUsers())
            .comments(schedule.getComments());

    return builder.build();
  }

  public static List<ScheduleDTO> toDTO(List<Schedule> schedules) {
    return schedules.stream().map(ScheduleDTO::toDTO).toList();
  }

  public static Slice<ScheduleDTO> toDTO(Slice<Schedule> schedules) {
    return schedules.map(ScheduleDTO::toDTO);
  }

}
