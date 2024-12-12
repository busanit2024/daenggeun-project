package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.GroupPost;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupPostRepository extends MongoRepository<GroupPost, String> {
}
