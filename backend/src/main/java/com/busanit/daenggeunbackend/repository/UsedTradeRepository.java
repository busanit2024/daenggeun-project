package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UsedTradeRepository extends MongoRepository<UsedTrade, String> {
    // 쿼리 메서드 후에 추가

    //검색 결과
    List<UsedTrade> findByContentContainingOrNameContaining(String content, String name);
    List<UsedTrade> findByCategory(String category, Sort sort);
    List<UsedTrade> findAll(Sort sort);
    List<UsedTrade> findByTradeable(boolean tradeable, Sort sort);
    List<UsedTrade> findByTradeableAndCategory(Boolean tradeable, String category, Sort sortOrder);

    //내가 올린 거래 목록
    Slice<UsedTrade> findByUserId(String userId, Pageable pageable);

    // 구+동+거래가능+카테고리
    @Query("{ 'location': { $regex: ?0 }, 'location': { $regex: ?1 }, 'tradeable': ?2, 'category': ?3 }")
    List<UsedTrade> findByLocationAndTradeableAndCategory(
        String sigungu, String emd, Boolean tradeable, String category, Sort sort);

    // 구+동+카테고리
    @Query("{ 'location': { $regex: ?0 }, 'location': { $regex: ?1 }, 'category': ?2 }")
    List<UsedTrade> findByLocationAndCategory(
        String sigungu, String emd, String category, Sort sort);

    // 구+동+거래가능
    @Query("{ 'location': { $regex: ?0 }, 'location': { $regex: ?1 }, 'tradeable': ?2 }")
    List<UsedTrade> findByLocationAndTradeable(
        String sigungu, String emd, Boolean tradeable, Sort sort);

    // 구+동
    @Query("{ 'location': { $regex: ?0 }, 'location': { $regex: ?1 }}")
    List<UsedTrade> findByLocation(String sigungu, String emd, Sort sort);

    // 구+거래가능+카테고리
    @Query("{ 'location': { $regex: ?0 }, 'tradeable': ?1, 'category': ?2 }")
    List<UsedTrade> findBySigunguAndTradeableAndCategory(
        String sigungu, Boolean tradeable, String category, Sort sort);

    // 구+카테고리
    @Query("{ 'location': { $regex: ?0 }, 'category': ?1 }")
    List<UsedTrade> findBySigunguAndCategory(String sigungu, String category, Sort sort);

    // 구+거래가능
    @Query("{ 'location': { $regex: ?0 }, 'tradeable': ?1 }")
    List<UsedTrade> findBySigunguAndTradeable(String sigungu, Boolean tradeable, Sort sort);

    // 구만
    @Query("{ 'location': { $regex: ?0 }}")
    List<UsedTrade> findBySigungu(String sigungu, Sort sort);
}