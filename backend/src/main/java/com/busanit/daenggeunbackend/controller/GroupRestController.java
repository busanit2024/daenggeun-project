package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/group")
public class GroupRestController {
  private final GroupService groupService;

  @GetMapping("/list")
  private List<GroupDTO> getGroups() {
    return groupService.findAll();
  }

  @GetMapping("/view/{groupId}")
  private GroupDTO getGroup(@PathVariable String groupId) {
    return groupService.findById(groupId);
  }

  @PostMapping("/save")
  private void saveGroup(@RequestBody GroupDTO groupDTO) {
    groupService.save(groupDTO);
  }
}