package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.domain.UserDTO;
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

    public Optional<User> findUserByUid(String uid) {
        return userRepository.findByUid(uid);
    }

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


    public User saveUserProfile(String uid, String username, String email, List<Location> userLocation, Image profileImage) {
        Optional<User> optionalUser = userRepository.findByUid(uid); // id 대신 uid로 사용자 찾기
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(username);
            user.setEmail(email);
            user.setLocation(userLocation);
            user.setProfileImage(profileImage);
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> findByUidIn(List<String> uids){
        return userRepository.findByUidIn(uids);
    }

    public List<User> findByUniqueCodeIn(List<String> uniqueCodes){
        return userRepository.findByUniqueCodeIn(uniqueCodes);
    }

    public User updateLocation(String uid, List<Location> locations) {
        User user = userRepository.findByUid(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLocation(locations);
        return userRepository.save(user);
    }





}