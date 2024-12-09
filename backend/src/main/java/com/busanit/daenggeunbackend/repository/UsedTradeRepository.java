package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UsedTradeRepository extends MongoRepository<UsedTrade, String> {
    // 쿼리 메서드 후에 추가

    //검색 결과
    List<UsedTrade> findByContentContainingOrNameContaining(String content, String name);
}