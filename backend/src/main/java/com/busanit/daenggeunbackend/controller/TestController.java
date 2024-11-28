package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.TestUser;
import com.busanit.daenggeunbackend.service.TestUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {
  private final TestUserService testUserService;
  @GetMapping("/test")
  public List<TestUser> test() {
    return testUserService.findAll();
  }

  @GetMapping("/test/save")
          public void save(@RequestParam String id, @RequestParam String username) {
    TestUser testUser = new TestUser();
    testUser.setId(id);
    testUser.setUsername(username);
    testUserService.save(testUser);
  }
}
