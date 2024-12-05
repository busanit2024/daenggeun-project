package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByPhone(String phone);

    boolean existsByUniqueCode(String uniqueCode);

    List<User> findByUidIn(List<String> uids);

    Optional<User> findByUid(String uid);
}