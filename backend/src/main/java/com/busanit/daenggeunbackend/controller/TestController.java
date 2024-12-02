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
          public void save(@RequestParam String id, @RequestParam String firstName, @RequestParam String lastName) {
    TestUser testUser = new TestUser();
    testUser.setUserId(id);
    testUser.setUsername(firstName, lastName);
    testUserService.save(testUser);
  }
}
