package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import com.busanit.daenggeunbackend.domain.UserDTO;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String uniqueCode; // 회원 코드
    private String uid; // 파이어베이스 uid
    private String phone;
    private String email;
    private String username; // 닉네임
    private Image profileImage;
    private List<Location> location; // 위치 리스트
    private Double mannerTemp;
    private List<String> trades; // 등록한 거래 id
    private List<String> bookmarks;
    private List<String> posts;
    private List<String> comments; // 작성 댓글 id

    public User(String phone, String uid, String uniqueCode) {
        this.phone = phone;
        this.uid = uid;
        this.uniqueCode = uniqueCode;
    }

    // UserDTO를 User로 변환하는 정적 메서드
    public static User toEntity(UserDTO userDTO) {
        return User.builder()
                .phone(userDTO.getPhone())
                .uid(userDTO.getUid())
                .uniqueCode(userDTO.getUniqueCode())
                .username(userDTO.getUsername())
                .profileImage(userDTO.getProfileImage())
                .location(userDTO.getLocation()) // List<Location>으로 변환
                .build();
    }
}