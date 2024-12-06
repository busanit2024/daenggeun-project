package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.constant.GroupRange;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.entity.GroupMember;
import lombok.*;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupDTO {
    private String id;
    private String title;
    private Image image;
    private String description;
    private Location location;
    private GroupRange groupRange; // 그룹 회원 거리 제한
    private String category;
    private List<String> boards;
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
    private List<Group.JoinRequest> requests; //가입 신청

  public static GroupDTO toDTO(Group group) {
    GroupDTOBuilder builder = GroupDTO.builder();
    builder.id(group.getId());
    builder.title(group.getTitle());
    builder.image(group.getImage());
    builder.description(group.getDescription());
    builder.location(group.getLocation());
    builder.groupRange(group.getGroupRange());
    builder.category(group.getCategory());
    builder.boards(group.getBoards());
    builder.createdDate(group.getCreatedDate());
    builder.requireIdCheck(group.getRequireIdCheck());
    builder.requireApproval(group.getRequireApproval());
    builder.ageRange(group.getAgeRange());
    builder.maxMember(group.getMaxMember());
    builder.useNickname(group.getUseNickname());
    builder.favoriteUsers(group.getFavoriteUsers());
    builder.members(group.getMembers());
    builder.posts(group.getPosts());
    builder.schedules(group.getSchedules());
    builder.requests(group.getRequests());
    return builder.build();
  }

  public static List<GroupDTO> toDTO(List<Group> groups) {
    return groups.stream().map(GroupDTO::toDTO).collect(Collectors.toList());
  }

  public static Slice<GroupDTO> toDTO(Slice<Group> groups) {
    return groups.map(GroupDTO::toDTO);
  }
}
