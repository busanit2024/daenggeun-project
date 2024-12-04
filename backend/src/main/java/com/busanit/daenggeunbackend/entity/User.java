package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import lombok.Generated;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
@Setter
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String uniqueCode; //회원 코드
    private String uid ; // 파이어베이스 uid
    private String phone;
    private String email;
    private String username; // 닉네임
    private Image profileImage;
    private List<Location> location;
    private Double mannerTemp;
    private List<String> trades; //등록한 거래 id
    private List<String> bookmarks;
    private List<String> posts;
    private List<String> comments; //작성댓글 id

    public User(String phone, String uid, String uniqueCode){
        this.phone = phone;
        this.uid = uid;
        this.uniqueCode = uniqueCode;
    }

    public User(){}

}