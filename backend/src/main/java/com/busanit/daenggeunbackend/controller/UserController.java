package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.repository.UserRepository;
import com.busanit.daenggeunbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/checkUniqueCode/{uniqueCode}")
    public ResponseEntity<Map<String, Boolean>> checkUniqueCode(@PathVariable String uniqueCode) {
        boolean exists = userService.checkUniqueCode(uniqueCode);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/join")
    public String joinUser(@RequestBody User user){
        userService.saveUser(user.getPhone(), user.getUid(), user.getUniqueCode());
        return "가입성공";
    }

    @GetMapping("/find/{phone}")
    public User findUser(@PathVariable String phone){
        return userService.findUserByPhone(phone).orElse(null);
    }

}