package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

  public List<GroupDTO> search(String sigungu, String emd, String category, String sort) {
    if (Objects.equals(category, "all")) {
      List<Group> groups = switch (sort) {
        case "name" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingOrderByTitleAsc(sigungu, emd);
        case "recent" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(sigungu, emd);
        default -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContaining(sigungu, emd);
      };
      return GroupDTO.toDTO(groups);
    }

    List<Group> groups = switch (sort) {
      case "name" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByTitleAsc(sigungu, emd, category);
      case "recent" -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(sigungu, emd, category);
      default -> groupRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(sigungu, emd, category);
    };
    return GroupDTO.toDTO(groups);
  }
}
