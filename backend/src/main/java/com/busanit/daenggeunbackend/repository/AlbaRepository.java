package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Alba;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbaRepository extends MongoRepository<Alba, String> {
    // 구 단위로만 검색
    List<Alba> findByLocationSigunguContaining(String sigungu, Pageable pageable);

    // 구와 동 모두로 검색
    List<Alba> findByLocationSigunguContainingAndLocationEmdContaining(
        String sigungu, String emd, Pageable pageable);

    // 지역과 카테고리로 검색
    List<Alba> findByLocationSigunguContainingAndLocationEmdContainingAndCategory(
        String sigungu, String emd, String category, Pageable pageable);

    // 지역, 카테고리, 검색어로 검색 (title과 description 모두 검색)
    List<Alba> findByLocationSigunguContainingAndLocationEmdContainingAndCategoryAndTitleContainingOrLocationSigunguContainingAndLocationEmdContainingAndCategoryAndDescriptionContaining(
        String sigungu, String emd, String category, String searchTerm,
        String sigungu2, String emd2, String category2, String searchTerm2,
        Pageable pageable);

    // 근무 기간으로 검색
    List<Alba> findByWorkPeriod(String workPeriod, Pageable pageable);

    // 근무 요일로 검색
    List<Alba> findByWorkDaysIn(List<String> workDays, Pageable pageable);

    // 근무 시간으로 검색
    List<Alba> findByWorkTimeStartGreaterThanEqualAndWorkTimeEndLessThanEqual(
        String start, String end, Pageable pageable);
}