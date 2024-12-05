package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean checkUniqueCode(String uniqueCode) {
        return userRepository.existsByUniqueCode(uniqueCode);
    }

    public void saveUser(String phone, String uid, String uniqueCode) {
        User user = new User();
        user.setPhone(phone);
        user.setUid(uid);
        user.setUniqueCode(uniqueCode);
        userRepository.save(user);
    }

    public Optional<User> findUserByPhone(String phone){
        return userRepository.findByPhone(phone);
    }

    public Optional<User> findUserByUid(String uid) {
        return userRepository.findByUid(uid);
    }



}