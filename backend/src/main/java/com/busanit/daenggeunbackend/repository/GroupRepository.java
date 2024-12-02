package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

  List<Group> findAllByLocationContaining(String location);

  List<Group> findAllByLocationContainingOrderByTitleAsc(String location);

  List<Group> findAllByLocationContainingOrderByCreatedDateDesc(String location);

  List<Group> findAllByLocationContainingAndCategory(String location, String category);

  List<Group> findAllByLocationContainingAndCategoryOrderByCreatedDateDesc(String location, String category);

  List<Group> findAllByLocationContainingAndCategoryOrderByTitleAsc(String location, String category);
}

