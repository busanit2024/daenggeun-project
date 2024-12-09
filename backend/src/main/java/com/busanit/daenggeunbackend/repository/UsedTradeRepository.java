package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UsedTradeRepository extends MongoRepository<UsedTrade, String> {
    List<UsedTrade> findByCategory(String category, Sort sort);
    List<UsedTrade> findAll(Sort sort);
    List<UsedTrade> findByTradeable(boolean tradeable, Sort sort);
    List<UsedTrade> findByTradeableAndCategory(Boolean tradeable, String category, Sort sortOrder);
}