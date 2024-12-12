package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.GroupDTO;
import com.busanit.daenggeunbackend.domain.GroupPostDTO;
import com.busanit.daenggeunbackend.domain.ScheduleDTO;
import com.busanit.daenggeunbackend.entity.Group;
import com.busanit.daenggeunbackend.entity.GroupMember;
import com.busanit.daenggeunbackend.entity.GroupPost;
import com.busanit.daenggeunbackend.entity.Schedule;
import com.busanit.daenggeunbackend.repository.GroupPostRepository;
import com.busanit.daenggeunbackend.repository.GroupRepository;
import com.busanit.daenggeunbackend.repository.ScheduleRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import static com.mongodb.client.model.Filters.eq;
import static org.springframework.data.mongodb.core.aggregation.BooleanOperators.Or.or;
import static org.springframework.data.mongodb.core.query.TypedCriteriaExtensionsKt.elemMatch;

@Service
@RequiredArgsConstructor
public class GroupService {
  private final GroupRepository groupRepository;
  private final GroupPostRepository groupPostRepository;

  @Autowired
  private MongoTemplate mongoTemplate;
  @Autowired
  private ScheduleRepository scheduleRepository;

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

  public Slice<GroupDTO> searchMyGroupPage(String sigungu, String emd, String category, String sort, String uid, Pageable pageable) {
    Criteria criteria = new Criteria().orOperator(
            Criteria.where("userId").is(uid),
            Criteria.where("members").elemMatch(Criteria.where("userId").is(uid))
    );

    if (!sigungu.isEmpty()) {
      criteria.and("location.sigungu").is(sigungu);
    }

    if (!emd.isEmpty()) {
      criteria.and("location.emd").is(emd);
    }

    if (!category.equals("all")) {
      criteria.and("category").is(category);
    }

    MatchOperation matchOperation = Aggregation.match(criteria);

    SortOperation sortOperation;

    if (sort.equals("name")) {
      sortOperation = Aggregation.sort(Sort.by(Sort.Direction.ASC, "title"));
    } else if (sort.equals("recent")) {
      sortOperation = Aggregation.sort(Sort.by(Sort.Direction.DESC, "createdDate"));
    } else {
      sortOperation = Aggregation.sort(Sort.by(Sort.DEFAULT_DIRECTION, "id"));
    }

    Aggregation aggregation = Aggregation.newAggregation(matchOperation, sortOperation);

    List<Group> results = mongoTemplate.aggregate(aggregation, "group", Group.class).getMappedResults();
    boolean hasNext = results.size() == pageable.getPageSize();

    Slice<Group> groups =  new SliceImpl<>(results, pageable, hasNext);
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

    if (group.getMaxMember() != 0 && members.size() >= group.getMaxMember()) {
      throw new RuntimeException("Maximum number of members reached");
    }

    boolean memberExists = members.stream().anyMatch(m -> m.getUserId().equals(member.getUserId()));

    if (memberExists) {
      throw new RuntimeException("Member already exists");
    }

    members.add(member);
    group.setMembers(members);
    groupRepository.save(group);
  }

  public void quitGroup(String groupId, String userId) {
    Group group = groupRepository.findById(groupId).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    List<GroupMember> members = group.getMembers();
    GroupMember member = members.stream().filter(groupMember -> groupMember.getUserId().equals(userId)).findFirst().orElse(null);
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

    if (group.getMaxMember() != 0 && members.size() >= group.getMaxMember()) {
      throw new RuntimeException("Maximum number of members reached");
    }

    boolean memberExists = members.stream().anyMatch(m -> m.getUserId().equals(joinRequest.getUserId()));

    if (memberExists) {
      throw new RuntimeException("Member already exists");
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

  //게시판
  @Transactional
  public void savePost(GroupPostDTO groupPostDTO) {
    Group group = groupRepository.findById(groupPostDTO.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }

    String currentId = groupPostDTO.getId();
    GroupPost currentpost = null;
    if (currentId != null) {
      currentpost = groupPostRepository.findById(currentId).orElse(null);
    }
    if (currentpost != null) {
      groupPostDTO.setCreatedDate(currentpost.getCreatedDate());
      groupPostRepository.save(GroupPost.toEntity(groupPostDTO));
      return;
    }

    GroupPost post = groupPostRepository.save(GroupPost.toEntity(groupPostDTO));
    String id = post.getId();

    List<String> posts = group.getPosts();
    if (posts == null) {
      posts = new ArrayList<>();
    }
    if (!posts.contains(id)) {
      posts.add(id);
      group.setPosts(posts);
    }

    List<GroupMember> members = group.getMembers();
    GroupMember currentMember = members.stream().filter(groupMember -> groupMember.getUserId().equals(post.getUserId())).findFirst().orElse(null);
    List<String> memberPosts = currentMember.getPosts();
    if (memberPosts == null) {
      memberPosts = new ArrayList<>();
    }

    if (!memberPosts.contains(id)) {
      memberPosts.add(id);
      currentMember.setPosts(memberPosts);
      members.remove(currentMember);
      members.add(currentMember);
      group.setMembers(members);
    }

    groupRepository.save(group);
  }

  public Slice<GroupPostDTO> getGroupPostSlice(String groupId, String boardName, Pageable pageable) {
    Criteria criteria = Criteria.where("groupId").is(groupId);
    if (!boardName.equals("all")) {
      criteria.and("board").in(List.of(boardName));
    }

    MatchOperation matchOperation = Aggregation.match(criteria);
    SortOperation sortOperation = Aggregation.sort(Sort.by(Sort.Direction.DESC, "createdDate"));

    Aggregation aggregation = Aggregation.newAggregation(matchOperation, sortOperation);

    List<GroupPost> results = mongoTemplate.aggregate(aggregation, "groupPost", GroupPost.class).getMappedResults();
    boolean hasNext = results.size() == pageable.getPageSize();

    Slice<GroupPost> groupPosts = new SliceImpl<>(results, pageable, hasNext);
    return GroupPostDTO.toDTO(groupPosts);
  }

  public GroupPostDTO getGroupPost(String postId, Boolean view) {
    GroupPost post = groupPostRepository.findById(postId).orElse(null);
    if (post == null) {
      throw new RuntimeException("Post not found");
    }
    if (view) {
      int currentView = post.getView();
      post.setView(currentView + 1);
      groupPostRepository.save(post);
    }
    return GroupPostDTO.toDTO(post);
  }

  @Transactional
  public void deletePost(GroupPostDTO groupPostDTO) {
    groupPostRepository.delete(GroupPost.toEntity(groupPostDTO));
    Group group = groupRepository.findById(groupPostDTO.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }
    List<String> posts = group.getPosts();
    if (posts.contains(groupPostDTO.getId())) {
      posts.remove(groupPostDTO.getId());
      group.setPosts(posts);
    }

    List<GroupMember> members = group.getMembers();
    GroupMember currentMember = members.stream().filter(groupMember -> groupMember.getUserId().equals(groupPostDTO.getUserId())).findFirst().orElse(null);
    List<String> memberPosts = currentMember.getPosts();

    if (memberPosts != null && memberPosts.contains(groupPostDTO.getId())) {
      memberPosts.remove(groupPostDTO.getId());
      currentMember.setPosts(memberPosts);
      members.remove(currentMember);
      members.add(currentMember);
      group.setMembers(members);
    }

    groupRepository.save(group);
  }

  @Transactional
  public void saveSchedule(ScheduleDTO scheduleDTO) {
    Group group = groupRepository.findById(scheduleDTO.getGroupId()).orElse(null);
    if (group == null) {
      throw new RuntimeException("Group not found");
    }

    String currentId = scheduleDTO.getId();
    Schedule currentSchedule = null;
    if (currentId != null) {
      currentSchedule = scheduleRepository.findById(currentId).orElse(null);
    }
    if (currentSchedule != null) {
      scheduleDTO.setCreatedDate(currentSchedule.getCreatedDate());
      scheduleRepository.save(Schedule.toEntity(scheduleDTO));
      return;
    }

    Schedule schedule = scheduleRepository.save(Schedule.toEntity(scheduleDTO));
    String id = schedule.getId();

    List<String> schedules = group.getSchedules();
    if (schedules == null) {
      schedules = new ArrayList<>();
    }
    if (!schedules.contains(id)) {
      schedules.add(id);
      group.setSchedules(schedules);
    }

    List<GroupMember> members = group.getMembers();
    GroupMember currentMember = members.stream().filter(groupMember -> groupMember.getUserId().equals(scheduleDTO.getUserId())).findFirst().orElse(null);
    List<String> memberAssigns = currentMember.getAssigns();
    if (memberAssigns == null) {
      memberAssigns = new ArrayList<>();
    }
    if (!memberAssigns.contains(id)) {
      memberAssigns.add(id);
      currentMember.setAssigns(memberAssigns);
      members.remove(currentMember);
      members.add(currentMember);
      group.setMembers(members);
    }

    groupRepository.save(group);
  }

  public Slice<ScheduleDTO> getScheduleSlice(String groupId, boolean closed, Pageable pageable) {
    Slice<Schedule> schedules = scheduleRepository.findByGroupIdAndClosed(groupId, closed, pageable);
    return ScheduleDTO.toDTO(schedules);
  }


}
