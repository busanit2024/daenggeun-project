package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
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

  @GetMapping("/search")
  private Slice<GroupDTO> searchGroups(@RequestParam String sigungu,
                                       @RequestParam String emd,
                                       @RequestParam String category,
                                       @RequestParam String sort,
                                       @RequestParam int page,
                                       @RequestParam int size) {
    Pageable pageable = PageRequest.of(page, size);
    return groupService.searchPage(sigungu, emd, category, sort, pageable);
  }

  @GetMapping("/view/{groupId}")
  private GroupDTO getGroup(@PathVariable String groupId) {
    return groupService.findById(groupId);
  }

  @PostMapping("/save")
  private void saveGroup(@RequestBody GroupDTO groupDTO) {
    groupService.save(groupDTO);
  }

  @DeleteMapping("/delete/{groupId}")
  private void deleteGroup(@PathVariable String groupId) {
    groupService.delete(groupId);
  }
}
