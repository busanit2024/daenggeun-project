package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.TestUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestUserRepository extends MongoRepository<TestUser, String> {
}
