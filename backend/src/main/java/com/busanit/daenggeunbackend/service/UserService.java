package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean checkUniqueCode(String uniqueCode) {
        return userRepository.existsByUniqueCode(uniqueCode);
    }

    public void saveUser(String phone, String uid, String uniqueCode, Double mannerTemp) {
        User user = new User();
        user.setPhone(phone);
        user.setUid(uid);
        user.setUniqueCode(uniqueCode);
        user.setMannerTemp(mannerTemp);
        userRepository.save(user);
    }

    public Optional<User> findUserByPhone(String phone){
        return userRepository.findByPhone(phone);
    }

    public Optional<User> findUserByUid(String uid) {
        return userRepository.findByUid(uid);
    }

    public User saveUserProfile(String id, String username, List<Location> userLocation, Image profileImage) {
        Optional<User> optionalUser = userRepository.findById(id); // id로 사용자 찾기
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(username);
            user.setLocation(userLocation); // Location 객체로 변환 필요
            user.setProfileImage(profileImage);
            return userRepository.save(user);
        }
        return null;
    }





}