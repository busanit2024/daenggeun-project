package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.CommentDTO;
import com.busanit.daenggeunbackend.entity.Comment;
import com.busanit.daenggeunbackend.entity.Community;
import com.busanit.daenggeunbackend.entity.Schedule;
import com.busanit.daenggeunbackend.repository.CommentRepository;
import com.busanit.daenggeunbackend.repository.CommunityRepository;
import com.busanit.daenggeunbackend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
  private final CommentRepository commentRepository;
  private final CommunityRepository communityRepository;
  private final ScheduleRepository scheduleRepository;

  public List<CommentDTO> findByPostId(String postId) {
    List<Comment> comments = commentRepository.findAllByPostIdOrderByCreatedDateAsc(postId);
    return CommentDTO.toDTO(comments);
  }

  @Transactional
  public void save(CommentDTO commentDTO) {
    Comment comment = commentRepository.save(Comment.toEntity(commentDTO));

    switch (commentDTO.getBoardType()) {
      case COMMUNITY -> {
        Community community = communityRepository.findById(commentDTO.getPostId()).orElse(null);
        if (community != null) {
          List<String> comments = community.getComments();
          if (comments == null) {
            comments = new ArrayList<>();
          }
          if (!comments.contains(comment.getId())) {
            comments.add(commentDTO.getId());
          }
          community.setComments(comments);
          communityRepository.save(community);
        }
      }
      case SCHEDULE -> {
        Schedule schedule = scheduleRepository.findById(commentDTO.getPostId()).orElse(null);
        if (schedule != null) {
          List<String> comments = schedule.getComments();
          if (comments == null) {
            comments = new ArrayList<>();
          }
          if (!comments.contains(comment.getId())) {
            comments.add(commentDTO.getId());
          }
          schedule.setComments(comments);
          scheduleRepository.save(schedule);
        }
      }
    }
  }

  @Transactional
  public void delete (CommentDTO commentDTO) {
    Comment comment = commentRepository.findById(commentDTO.getId()).orElse(null);
    if (comment == null) {
      throw new RuntimeException("Comment not found");
    }

    commentRepository.delete(comment);
    switch (commentDTO.getBoardType()) {
      case COMMUNITY -> {
        Community community = communityRepository.findById(commentDTO.getPostId()).orElse(null);
        if (community != null) {
          List<String> comments = community.getComments();
          if (comments != null && comments.contains(comment.getId())) {
            comments.remove(commentDTO.getId());
            community.setComments(comments);
            communityRepository.save(community);
          }
        }
      }

      case SCHEDULE -> {
        Schedule schedule = scheduleRepository.findById(commentDTO.getPostId()).orElse(null);
        if (schedule != null) {
          List<String> comments = schedule.getComments();
          if (comments != null && comments.contains(comment.getId())) {
            comments.remove(commentDTO.getId());
            schedule.setComments(comments);
            scheduleRepository.save(schedule);
          }
        }
      }
    }
  }
}
