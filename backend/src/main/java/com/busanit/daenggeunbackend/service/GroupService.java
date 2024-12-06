package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.entity.GroupMember;
import com.busanit.daenggeunbackend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GroupService {
  private final GroupRepository groupRepository;

  public List<GroupDTO> findAll() {
     List<Group> groups = groupRepository.findAll();
     return GroupDTO.toDTO(groups);
  }

  public GroupDTO findById(String id) {
    Group group = groupRepository.findById(id).orElse(null);
    if (group == null) {
      return null;
    }
    return GroupDTO.toDTO(group);
  }

  public void save(GroupDTO groupDTO) {
    groupRepository.save(Group.toEntity(groupDTO));
  }

  public String saveAndGetId(GroupDTO groupDTO) {
    return groupRepository.save(Group.toEntity(groupDTO)).getId();
  }

  @Transactional
  public void createGroup(GroupDTO groupDTO) {
    Group group = groupRepository.save(Group.toEntity(groupDTO));
    GroupMember admin = group.getMembers().stream()
            .filter(member -> member.getPosition() == GroupMember.Position.ADMIN)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Admin member not found"));

    admin.setGroupId(group.getId());

    group.getMembers().remove(admin);
    group.getMembers().add(admin);

    groupRepository.save(group);
  }

  public void delete(String id) {
    groupRepository.deleteById(id);
  }

  public Slice<GroupDTO> searchPage(String sigungu, String emd, String category, String sort, Pageable pageable) {
    if (Objects.equals(category, "all")) {
      Slice<Group> groups = switch (sort) {
        case "name" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingOrderByTitleAsc(sigungu, emd, pageable);
        case "recent" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(sigungu, emd, pageable);
        default -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContaining(sigungu, emd, pageable);
      };
      return GroupDTO.toDTO(groups);
    }

    Slice<Group> groups = switch (sort) {
      case "name" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByTitleAsc(sigungu, emd, category, pageable);
      case "recent" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(sigungu, emd, category, pageable);
      default -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(sigungu, emd, category, pageable);
    };
    return GroupDTO.toDTO(groups);
  }

  public void joinGroup(GroupMember member) {
    Group group = groupRepository.findById(member.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    List<GroupMember> members = group.getMembers();
    if (members == null) {
      members = new ArrayList<>();
    }
    if (!members.contains(member)) {
      members.add(member);
      group.setMembers(members);
      groupRepository.save(group);
    } else {
      throw new RuntimeException("Member already exists");
    }
  }

  public void quitGroup(GroupMember member) {
    Group group = groupRepository.findById(member.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    List<GroupMember> members = group.getMembers();
    if (members.contains(member)) {
      members.remove(member);
    } else {
      throw new RuntimeException("Member does not exist");
    }
    group.setMembers(members);
    groupRepository.save(group);
  }

  private void requestStatusChange(Group.Status status, Group group, String userId) {
    List<Group.JoinRequest> requests = group.getRequests();
    Group.JoinRequest currentRequest = requests.stream().filter(r -> r.getUserId().equals(userId)).findFirst().orElse(null);
    if (currentRequest != null) {
      currentRequest.setStatus(status);
      requests.remove(currentRequest);
      requests.add(currentRequest);
      group.setRequests(requests);
    } else throw new RuntimeException("Requests not found");

  }


  @Transactional
  public void acceptRequest(Group.JoinRequest joinRequest) {
    Group group = groupRepository.findById(joinRequest.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    List<GroupMember> members = group.getMembers();
    if (members == null) {
      members = new ArrayList<>();
    }
    GroupMember member = new GroupMember();
    member.setGroupId(joinRequest.getGroupId());
    member.setUserId(joinRequest.getUserId());
    member.setPosition(GroupMember.Position.MEMBER);
    member.setGroupNickName(joinRequest.getGroupNickName());
    LocalDateTime date = new Date().toInstant().atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime();
    member.setRegisteredDate(date);
    members.add(member);
    group.setMembers(members);

    requestStatusChange(Group.Status.APPROVED, group, joinRequest.getUserId());

    groupRepository.save(group);
  }

  @Transactional
  public void rejectRequest(Group.JoinRequest joinRequest) {
    Group group = groupRepository.findById(joinRequest.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    requestStatusChange(Group.Status.REJECTED, group, joinRequest.getUserId());
    groupRepository.save(group);
  }
}
