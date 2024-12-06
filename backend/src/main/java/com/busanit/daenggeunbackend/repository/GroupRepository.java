package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContaining(String locationSigungu, String locationEmd, Pageable pageable);

  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByTitleAsc(String locationSigungu, String locationEmd , Pageable pageable);

  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(String locationSigungu, String locationEmd , Pageable pageable);

  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(String locationSigungu, String locationEmd, String category , Pageable pageable);

  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(String locationSigungu, String locationEmd, String category , Pageable pageable);

  Slice<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByTitleAsc(String locationSigungu, String locationEmd, String category , Pageable pageable);
  }

