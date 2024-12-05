package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.repository.UserRepository;
import com.busanit.daenggeunbackend.dto.UserProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Value("${file.upload.directory}")
    private String uploadDirectory;

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

    public UserProfileDTO saveProfile(String username, String location, MultipartFile profileImageFile, String uid) throws IOException {
        User user = userRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 기존 프로필 이미지가 있다면 삭제
        if (user.getProfileImage() != null) {
            deleteExistingProfileImage(user.getProfileImage().getUrl());
        }

        // 새 이미지가 있다면 저장
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            String imageUrl = saveProfileImage(profileImageFile, uid);
            Image profileImage = new Image();
            profileImage.setUrl(imageUrl);
            user.setProfileImage(profileImage);
        }

        // Location 정보 파싱 및 설정
        String[] locationParts = location.split(",");
        if (locationParts.length == 3) {
            Location userLocation = new Location();
            userLocation.setSido(locationParts[0]);
            userLocation.setSigungu(locationParts[1]);
            userLocation.setEmd(locationParts[2]);
            user.setLocation(Collections.singletonList(userLocation));
        } else {
            throw new IllegalArgumentException("잘못된 위치 정보 형식입니다.");
        }

        user.setUsername(username);
        
        User savedUser = userRepository.save(user);
        return UserProfileDTO.fromEntity(savedUser);
    }

    private String saveProfileImage(MultipartFile file, String uid) throws IOException {
        // 파일 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        
        // 새 파일명 생성 (UID + 타임스탬프 + 확장자)
        String newFileName = uid + "_" + System.currentTimeMillis() + extension;
        
        // 업로드 디렉토리가 없으면 생성
        File directory = new File(uploadDirectory);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 파일 저장
        Path filePath = Paths.get(uploadDirectory, newFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return newFileName;
    }

    public void deleteProfileImage(String uid) {
        User user = userRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (user.getProfileImage() != null) {
            deleteExistingProfileImage(user.getProfileImage().getUrl());
            user.setProfileImage(null);
            userRepository.save(user);
        }
    }

    private void deleteExistingProfileImage(String imageUrl) {
        if (imageUrl != null) {
            Path imagePath = Paths.get(uploadDirectory, imageUrl);
            try {
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("이미지 파일 삭제 실패", e);
            }
        }
    }

}