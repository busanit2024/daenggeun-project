package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean checkUniqueCode(String uniqueCode) {
        return userRepository.findByUniqueCode(uniqueCode).isPresent();
    }

    public User saveUser(String phone, String uid, String uniqueCode){
        User user = new User(phone, uid, uniqueCode);
        return userRepository.save(user);
    }

    public Optional<User> findUserByPhone(String phone){
        return userRepository.findByPhone(phone);
    }
}