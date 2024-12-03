package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContaining(String locationSigungu, String locationEmd);

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByTitleAsc(String locationSigungu, String locationEmd);

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(String locationSigungu, String locationEmd);

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategory(String locationSigungu, String locationEmd, String category);

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(String locationSigungu, String locationEmd, String category);

  List<Group> findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByTitleAsc(String locationSigungu, String locationEmd, String category);
}

