package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.FilterData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilterDataRepository extends MongoRepository<FilterData, String> {
  FilterData findByName(String name);
}
