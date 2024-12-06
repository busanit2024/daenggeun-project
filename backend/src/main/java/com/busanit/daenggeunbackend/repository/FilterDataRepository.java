package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.entity.FilterData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilterDataRepository extends MongoRepository<FilterData, String> {
  FilterData findByName(String name);
}
