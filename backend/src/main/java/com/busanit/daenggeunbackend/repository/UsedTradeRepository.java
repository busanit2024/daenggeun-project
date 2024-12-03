package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsedTradeRepository extends MongoRepository<UsedTrade, String> {
    // 쿼리 메서드 후에 추가
}