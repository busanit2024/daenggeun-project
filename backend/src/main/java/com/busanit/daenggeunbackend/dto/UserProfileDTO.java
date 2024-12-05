package com.busanit.daenggeunbackend.dto;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.Collections;

@Data
@Builder
public class UserProfileDTO {
    private String id;
    private String username;
    private String sido;
    private String sigungu;
    private String emd;
    private Image profileImage;
    
    // DTO -> Entity 변환
    public static User toEntity(UserProfileDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        
        // Location 객체 생성
        Location location = new Location();
        location.setSido(dto.getSido());
        location.setSigungu(dto.getSigungu());
        location.setEmd(dto.getEmd());
        user.setLocation(Collections.singletonList(location));
        
        user.setProfileImage(dto.getProfileImage());
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        return user;
    }

    // Entity -> DTO 변환
    public static UserProfileDTO fromEntity(User user) {
        Location location = user.getLocation().get(0);
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .sido(location.getSido())
                .sigungu(location.getSigungu())
                .emd(location.getEmd())
                .profileImage(user.getProfileImage())
                .build();
    }
} 