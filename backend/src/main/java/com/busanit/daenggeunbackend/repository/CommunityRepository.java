package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Community;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    
    // 동네와 카테고리에 따라 커뮤니티를 작성일 기준 내림차순으로 가져오기
    Slice<Community> findAllByLocationContainingAndCategoryOrderByCreatedDateDesc(String locationSigungu, String locationEmd, String category, Pageable pageable);

    // 인기글: 조회수 기준으로 정렬
    Slice<Community> findAllByOrderByViewsDesc(String locationSigungu, String locationEmd,Pageable pageable);

    // 전체 카테고리: 동네별 작성일 기준 내림차순으로 가져오기
    Slice<Community> findAllByLocationContainingOrderByCreatedDateDesc(String locationSigungu, String locationEmd, Pageable pageable);
}