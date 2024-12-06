package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Page<Community> findAll(Pageable pageable);  // MongoRepository에서 페이징을 지원
}
