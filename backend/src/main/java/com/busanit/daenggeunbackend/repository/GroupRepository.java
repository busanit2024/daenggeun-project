package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

}
