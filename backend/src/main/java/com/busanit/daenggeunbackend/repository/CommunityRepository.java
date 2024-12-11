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

    // emd가 빈 값일 때 sigungu만으로 검색
    Slice<Community> findAllByLocationSigunguContainingAndCategory(String locationSigungu, String category, Pageable pageable);

    // emd가 있을 때 sigungu와 emd로 검색
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(String locationSigungu, String locationEmd, String category, Pageable pageable);

    // 검색 기능
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryAndTitleContaining(
            String sigungu, String emd, String category, String searchTerm, Pageable pageable);

    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndTitleContaining(
            String sigungu, String emd, String searchTerm, Pageable pageable);

    // sigungu와 title로 검색
    Slice<Community> findAllByLocationSigunguContainingAndTitleContaining(String sigungu, String title, Pageable pageable);

    // sigungu, category, title로 검색
    Slice<Community> findAllByLocationSigunguContainingAndCategoryAndTitleContaining(
            String sigungu, String category, String title, Pageable pageable);

    // sigungu만으로 검색
    Slice<Community> findAllByLocationSigunguContaining(String locationSigungu, Pageable pageable);

    // sigungu와 emd로 검색
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContaining(String locationSigungu, String locationEmd, Pageable pageable);

    Slice<Community> findByUserId(String userId, Pageable pageable);
}