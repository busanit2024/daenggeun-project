package com.busanit.daenggeunbackend.entity;

import org.springframework.data.annotation.id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trades")
@Getter
@Setter
public class UsedTrade {
    @id
    private String id;  // 중고거래 id
    private String userId;  // 사용자 id
    private String name;    // 상품명
    private int price;  // 가격
    private String location;    // 거래 위치
    private LocalDateTime createdDate;  // 생성일
    private String content; // 상세설명
    private List<String> images;    // 이미지 링크
    private int views;  // 조회수
    private List<String> bookmarkUsers; // 북마크 사용자
}