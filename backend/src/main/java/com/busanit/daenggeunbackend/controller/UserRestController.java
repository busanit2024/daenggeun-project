package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.dto.LocationDTO;
import com.busanit.daenggeunbackend.dto.UserProfileRequestDTO;
import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserRestController {

    private final UserService userService;

    //userid불러오기
    @GetMapping("/{uid}")
    public ResponseEntity<User> getUserByUid(@PathVariable String uid) {
        return userService.findUserByUid(uid)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/checkUniqueCode/{uniqueCode}")
    public ResponseEntity<Map<String, Boolean>> checkUniqueCode(@PathVariable String uniqueCode) {
        boolean exists = userService.checkUniqueCode(uniqueCode);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/find/{phone}")
    public User findUser(@PathVariable String phone){
        return userService.findUserByPhone(phone).orElse(null);
    }


    @PostMapping("/join")
    public String joinUser(@RequestBody User user){
        userService.saveUser(user.getPhone(), user.getUid(), user.getUniqueCode(), user.getMannerTemp());
        return "가입성공";
    }


    @PostMapping("/profileSave/{id}")
    public ResponseEntity<String> saveUserProfile(@PathVariable String id, @RequestBody UserProfileRequestDTO request) {
        Image profileImage = null;

        // 프로필 이미지가 제공된 경우에만 설정
        if (request.getProfileImage() != null) {
            profileImage = new Image();
            profileImage.setUrl(request.getProfileImage().getUrl());
            profileImage.setFilename(request.getProfileImage().getFilename());
            profileImage.setFilePath(request.getProfileImage().getFilePath());
        }

        // userLocation 변환
        List<Location> locations = new ArrayList<>();
        for (LocationDTO locationDTO : request.getUserLocation()) {
            Location location = new Location();
            location.setSido(locationDTO.getSido());
            location.setSigungu(locationDTO.getSigungu());
            location.setEmd(locationDTO.getEmd());
            locations.add(location);
        }

        // id를 사용하여 사용자 프로필 저장
        User updatedUser = userService.saveUserProfile(id, request.getUsername(), locations, profileImage);

        if (updatedUser != null) {
            System.out.println("ID: " + id);
            System.out.println("Request Body: " + request);
            return ResponseEntity.ok("프로필이 성공적으로 저장되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
    }

}