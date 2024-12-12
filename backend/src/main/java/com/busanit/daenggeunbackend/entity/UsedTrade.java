package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "usedTrade")
@Getter
@Setter
public class UsedTrade {
    @Id
    private String id;  // 중고거래 id
    private String userId;  // 판매자 id
    private String name;    // 상품명
    private String category;    // 카테고리
    private int price;  // 가격
    private String location;    // 거래 위치
    @CreatedDate
    private LocalDateTime createdDate;  // 생성일
    private String content; // 상세설명
    private List<Image> images;    // 이미지 링크
    private int views;  // 조회수
    private boolean isNegotiable;   // 네고 가능 여부
    private boolean isGiveable;  // 나눔 신청 가능 여부
    private boolean isGived;    // 판매, 나눔 여부
    private boolean tradeable;  // 거래 가능 여부
    private List<String> bookmarkUsers; // 북마크 사용자
    // 거래 희망 장소
    private String tradePlace;
    private byte[] imageData;

}