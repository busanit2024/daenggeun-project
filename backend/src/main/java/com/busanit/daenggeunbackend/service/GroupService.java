package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

  public void delete(String id) {
    groupRepository.deleteById(id);
  }

  public List<GroupDTO> search(String gu, String dong, String category, String sort) {
    if (Objects.equals(category, "all")) {
      List<Group> groups = switch (sort) {
        case "name" -> groupRepository.findAllByLocationGuContainingOrLocationDongContainingOrderByTitleAsc(gu, dong);
        case "recent" -> groupRepository.findAllByLocationGuContainingOrLocationDongContainingOrderByCreatedDateDesc(gu, dong);
        default -> groupRepository.findAllByLocationGuContainingOrLocationDongContaining(gu, dong);
      };
      return GroupDTO.toDTO(groups);
    }

    List<Group> groups = switch (sort) {
      case "name" -> groupRepository.findAllByLocationGuContainingOrLocationDongContainingAndCategoryOrderByTitleAsc(gu, dong, category);
      case "recent" -> groupRepository.findAllByLocationGuContainingOrLocationDongContainingAndCategoryOrderByCreatedDateDesc(gu, dong, category);
      default -> groupRepository.findAllByLocationGuContainingOrLocationDongContainingAndCategory(gu, dong, category);
    };
    return GroupDTO.toDTO(groups);
  }
}
