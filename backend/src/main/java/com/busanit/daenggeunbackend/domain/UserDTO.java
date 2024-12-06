package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.entity.User;
import com.busanit.daenggeunbackend.domain.Location;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserDTO {
    private String phone;
    private String uid;
    private String uniqueCode;
    private String username;
    private Image profileImage;
    private List<Location> location; // List<Location>으로 정의

    // User 엔티티를 UserDTO로 변환하는 정적 메서드
    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setPhone(user.getPhone());
        userDTO.setUid(user.getUid());
        userDTO.setUniqueCode(user.getUniqueCode());
        userDTO.setUsername(user.getUsername());
        userDTO.setProfileImage(user.getProfileImage());
        userDTO.setLocation(user.getLocation()); // List<Location>으로 변환
        return userDTO;
    }

    // User 리스트를 UserDTO 리스트로 변환하는 메서드
    public static List<UserDTO> toDTO(List<User> users) {
        return users.stream().map(UserDTO::toDTO).collect(Collectors.toList());
    }
}