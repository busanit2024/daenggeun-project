package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

  List<Group> findAllByLocationGuContainingOrLocationDongContaining(String locationSi, String locationDong);

  List<Group> findAllByLocationGuContainingOrLocationDongContainingOrderByTitleAsc(String locationSi, String locationDong);

  List<Group> findAllByLocationGuContainingOrLocationDongContainingOrderByCreatedDateDesc(String locationSi, String locationDong);

  List<Group> findAllByLocationGuContainingOrLocationDongContainingAndCategory(String locationSi, String locationDong, String category);

  List<Group> findAllByLocationGuContainingOrLocationDongContainingAndCategoryOrderByCreatedDateDesc(String locationSi, String locationDong, String category);

  List<Group> findAllByLocationGuContainingOrLocationDongContainingAndCategoryOrderByTitleAsc(String locationSi, String locationDong, String category);
}

