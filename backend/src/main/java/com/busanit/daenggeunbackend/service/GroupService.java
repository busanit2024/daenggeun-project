package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
