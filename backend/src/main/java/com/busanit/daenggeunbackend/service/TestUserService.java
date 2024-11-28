package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.TestUser;
import com.busanit.daenggeunbackend.repository.TestUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestUserService {
  private final TestUserRepository testUserRepository;

  public void save(TestUser testUser) {
    testUserRepository.save(testUser);
  }

  public List<TestUser> findAll() {
    return testUserRepository.findAll();
  }
}
