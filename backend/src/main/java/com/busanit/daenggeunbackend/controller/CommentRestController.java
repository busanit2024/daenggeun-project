package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.CommentDTO;
import com.busanit.daenggeunbackend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentRestController {
  private final CommentService commentService;

  @GetMapping("/list/{postId}")
  public List<CommentDTO> getCommentList(@PathVariable String postId) {
    return commentService.findByPostId(postId);
  }

  @PostMapping("/write")
  public void writeComment(@RequestBody CommentDTO commentDTO) {
    commentService.save(commentDTO);
  }

  @PostMapping("/delete")
  public void deleteComment(@RequestBody CommentDTO commentDTO) {
    commentService.delete(commentDTO);
  }
}
