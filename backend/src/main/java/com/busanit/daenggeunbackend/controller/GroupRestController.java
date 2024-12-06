package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.entity.GroupMember;
import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.service.GroupService;
import com.busanit.daenggeunbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/group")
public class GroupRestController {
  private final GroupService groupService;
  private final UserService userService;

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

  @PostMapping("/new")
  private ResponseEntity<String> createGroup(@RequestBody GroupDTO groupDTO) {
    try {
      groupService.createGroup(groupDTO);
      return ResponseEntity.ok("Group created");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/save")
  private void saveGroup(@RequestBody GroupDTO groupDTO) {
    groupService.save(groupDTO);
  }

  @DeleteMapping("/delete/{groupId}")
  private void deleteGroup(@PathVariable String groupId) {
    groupService.delete(groupId);
  }

  @PostMapping("/members")
  private List<User> joinMembersAndUser(@RequestBody ArrayList<String> uids) {
    return userService.findByUidIn(uids);
  }

  @PostMapping("/join")
  private void joinGroup(@RequestBody GroupMember member) {
    groupService.joinGroup(member);
  }

  @PostMapping("/quit")
  private void quitGroup(@RequestBody Map<String, String> data) {
    String groupId = data.get("groupId");
    String userId = data.get("userId");
    groupService.quitGroup(groupId, userId);
  }

  @PostMapping("/join/request")
  private ResponseEntity<String> joinRequest(@RequestBody Group.JoinRequest request) {
    GroupDTO groupDTO = groupService.findById(request.getGroupId());
    List<Group.JoinRequest> requests = groupDTO.getRequests();
    if (requests == null) {
      requests = new ArrayList<>();
    }

    List<Group.JoinRequest> existingRequests = requests.stream()
            .filter(r -> r.getUserId().equals(request.getUserId())).toList();

    System.out.println(existingRequests);

    boolean exists = existingRequests.stream()
            .anyMatch(r -> r.getStatus().equals(Group.Status.PENDING));

    if (exists) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Join request already exists");
    }

    requests.add(request);
    groupDTO.setRequests(requests);
    groupService.save(groupDTO);
    return ResponseEntity.ok("Join request created");
  }

  @PostMapping("/join/request/accept")
  private void joinRequestAccept(@RequestBody Group.JoinRequest request) {
    groupService.acceptRequest(request);
  }

  @PostMapping("/join/request/reject")
  private void joinRequestReject(@RequestBody Group.JoinRequest request) {
    groupService.rejectRequest(request);
  }
}
