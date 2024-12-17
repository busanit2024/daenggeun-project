package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
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
    List<UsedTrade> findByLocationContainingAndLocationContainingAndTradeableAndCategory(
        String sigungu, String emd, Boolean tradeable, String category, Sort sort);

    // 구+동+카테고리
    List<UsedTrade> findByLocationContainingAndLocationContainingAndCategory(
        String sigungu, String emd, String category, Sort sort);

    // 구+동+거래가능
    List<UsedTrade> findByLocationContainingAndLocationContainingAndTradeable(
        String sigungu, String emd, Boolean tradeable, Sort sort);

    // 구+동
    List<UsedTrade> findByLocationContainingAndLocationContaining(
        String sigungu, String emd, Sort sort);

    // 구+거래가능+카테고리
    List<UsedTrade> findByLocationContainingAndTradeableAndCategory(
        String sigungu, Boolean tradeable, String category, Sort sort);

    // 구+카테고리
    List<UsedTrade> findByLocationContainingAndCategory(
        String sigungu, String category, Sort sort);

    // 구+거래가능
    List<UsedTrade> findByLocationContainingAndTradeable(
        String sigungu, Boolean tradeable, Sort sort);

    // 구만
    List<UsedTrade> findByLocationContaining(String sigungu, Sort sort);
}