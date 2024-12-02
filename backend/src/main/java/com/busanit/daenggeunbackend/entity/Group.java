package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.constant.GroupRange;
import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.domain.Image;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Group {
  @Id
  private String id;
  private String userId;
  private String title;
  private List<Image> images;
  private String description;
  private String Location;
  private GroupRange groupRange; // 그룹 회원 거리 제한
  private String category;
  @CreatedDate
  private LocalDateTime createdDate;
  private Boolean requireIdCheck; // 본인인증 필요 여부
  private Boolean requireApproval; //가입 승인 필요 여부
  private String ageRange; // 나이제한
  private int maxMember; //최대 인원수
  private Boolean useNickname; // 별명 사용 여부
  private List<String> favoriteUsers; // 관심 등록 유저 id
  private List<GroupMember> members; //멤버 클래스 리스트
  private List<String> posts; //게시글 id
  private List<String> schedules; // 일정 id


  public static Group toEntity(GroupDTO groupDTO) {
    GroupBuilder builder = Group.builder()
            .title(groupDTO.getTitle())
            .description(groupDTO.getDescription())
            .Location(groupDTO.getLocation())
            .groupRange(groupDTO.getGroupRange())
            .category(groupDTO.getCategory())
            .createdDate(groupDTO.getCreatedDate())
            .requireIdCheck(groupDTO.getRequireIdCheck())
            .requireApproval(groupDTO.getRequireApproval())
            .ageRange(groupDTO.getAgeRange())
            .maxMember(groupDTO.getMaxMember())
            .useNickname(groupDTO.getUseNickname())
            .favoriteUsers(groupDTO.getFavoriteUsers())
            .members(groupDTO.getMembers())
            .posts(groupDTO.getPosts())
            .schedules(groupDTO.getSchedules())
            .favoriteUsers(groupDTO.getFavoriteUsers())
            .schedules(groupDTO.getSchedules());
    if (groupDTO.getId() != null) {
      builder.id(groupDTO.getId());
    }
    return builder.build();
  }
}



