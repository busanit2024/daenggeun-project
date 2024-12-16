package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
  List<Comment> findAllByPostIdOrderByCreatedDateAsc(String postId);
}
