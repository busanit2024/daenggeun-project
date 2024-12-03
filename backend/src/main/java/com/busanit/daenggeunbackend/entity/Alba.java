package com.busanit.daenggeunbackend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Setter
@Document(collection = "alba")
public class Alba {

    @Id
    private String id; // 알바 ID
    private String creatorId; // 작성자 ID
    private String title; // 제목
    private String description; // 상세내용
    private String createdAt; // 작성시간 (ISO 8601 형식 추천)
    private String wage; // 시급/월급
    private String workType; // 근무 유형 (단기/장기)
    private List<String> workDays; // 근무요일
    private WorkTime workTime; // 근무시간
    private String location; // 위치
    private List<Application> applications; // 지원 리스트
    private List<Review> reviews; // 리뷰 리스트
    private List<String> interests; // 관심 등록한 사용자 ID 리스트
}

// 근무 시간 클래스
@Getter
@Setter
class WorkTime {
    private String start; // 시작 시간
    private String end; // 종료 시간
}

// 지원 정보 서브 도큐먼트
@Getter
@Setter
class Application {
    private String applicationId; // 지원 ID
    private String albaId; // 알바 ID
    private String applicantId; // 지원자 ID
    private String applicationDate; // 지원 날짜 (ISO 8601 형식 추천)
    private String status; // 상태 (지원중/수락/거절 등)
}

// 리뷰 정보 서브 도큐먼트
@Getter
@Setter
class Review {
    private String reviewId; // 리뷰 ID
    private String albaId; // 알바 ID
    private String authorId; // 작성자 ID
    private int score; // 점수
}
