package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsedTradeRepository extends MongoRepository<UsedTrade, String> {

}