package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Page<Community> findAll(Pageable pageable);
//    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContaining(String locationSigungu, String locationEmd, Pageable pageable);
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(String locationSigungu, String locationEmd, String category, Pageable pageable);
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(String locationSigungu, String locationEmd, Pageable pageable);
}

