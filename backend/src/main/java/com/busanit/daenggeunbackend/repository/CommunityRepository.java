package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Page<Community> findAll(Pageable pageable);

    // emd가 빈 값일 때 sigungu만으로 검색
    Slice<Community> findAllByLocationSigunguContainingAndCategoryOrderByCreatedDateDesc(String locationSigungu, String category, Pageable pageable);

    // emd가 있을 때 sigungu와 emd로 검색
    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(String locationSigungu, String locationEmd, String category, Pageable pageable);

    // 검색 기능
    @Query("{ 'locationSigungu': { $regex: ?0 }, 'locationEmd': { $regex: ?1 }, 'category': ?2, $or: [ { 'title': { $regex: ?3 } }, { 'content': { $regex: ?3 } } ] }")
    Slice<Community> findByLocationAndCategoryAndSearchTerm(
            String sigungu, String emd, String category, String searchTerm,
            Pageable pageable);

    @Query("{ 'locationSigungu': { $regex: ?0 }, 'locationEmd': { $regex: ?1 }, $or: [ { 'title': { $regex: ?2 } }, { 'content': { $regex: ?2 } } ] }")
    Slice<Community> findByLocationAndSearchTerm(
            String sigungu, String emd, String searchTerm,
            Pageable pageable);

    @Query("{ 'locationSigungu': { $regex: ?0 }, $or: [ { 'title': { $regex: ?1 } }, { 'content': { $regex: ?1 } } ] }")
    Slice<Community> findByLocationSigunguAndSearchTerm(
            String sigungu, String searchTerm,
            Pageable pageable);

    @Query("{ 'locationSigungu': { $regex: ?0 }, 'category': ?1, $or: [ { 'title': { $regex: ?2 } }, { 'content': { $regex: ?2 } } ] }")
    Slice<Community> findByLocationSigunguAndCategoryAndSearchTerm(
            String sigungu, String category, String searchTerm,
            Pageable pageable);

    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingAndTitleContainingOrContentContainingOrderByCreatedDateDesc(
            String sigungu, String emd, String searchTerm, Pageable pageable);

    // sigungu와 title/content로 검색
    Slice<Community> findAllByLocationSigunguContainingAndTitleContainingOrContentContainingOrderByCreatedDateDesc(
            String sigungu, String searchTerm, Pageable pageable);

    // sigungu, category, title/content로 검색
    Slice<Community> findAllByLocationSigunguContainingAndCategoryAndTitleContainingOrContentContainingOrderByCreatedDateDesc(
            String sigungu, String category, String searchTerm, Pageable pageable);

    // sigungu만으로 검색
    Slice<Community> findAllByLocationSigunguContainingOrderByCreatedDateDesc(String locationSigungu, Pageable pageable);

    // sigungu와 emd로 검색

    Slice<Community> OrderByCreatedDateDesc(String locationSigungu, String locationEmd, Pageable pageable);

    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(String sigungu, String emd, Pageable pageable);

    Slice<Community> findAllByLocationSigunguContainingAndLocationEmdContaining(String locationSigungu, String locationEmd, Pageable pageable);

    Slice<Community> findByUserId(String userId, Pageable pageable);
    

}