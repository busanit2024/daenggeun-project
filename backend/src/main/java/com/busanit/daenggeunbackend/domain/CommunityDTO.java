package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.Community;
import lombok.*;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityDTO {
    private String id;
    private String userId;  // 작성자 ID
    private String title;  // 글 제목
    private String content;  // 글 내용
    private List<Image> images;  // 첨부된 이미지
    private Location location;  // 위치
    private String category;  // 카테고리
    private int views;  // 조회수
    private List<String> bookmarkUsers;  // 북마크한 유저들
    private List<String> likeUsers;  // 좋아요한 유저들
    private List<String> comments;  // 댓글 ID 목록
    private LocalDateTime createdDate;  // 작성일

    public static CommunityDTO toDTO(Community community) {
        return CommunityDTO.builder()
                .id(community.getId())
                .userId(community.getUserId())
                .title(community.getTitle())
                .content(community.getContent())
                .images(community.getImages())
                .location(community.getLocation())
                .category(community.getCategory())
                .views(community.getViews())
                .bookmarkUsers(community.getBookmarkUsers())
                .likeUsers(community.getLikeUsers())
                .comments(community.getComments())
                .createdDate(community.getCreatedDate())
                .build();
    }

    public static List<CommunityDTO> toDTO(List<Community> communities) {
        return communities.stream()
                .map(CommunityDTO::toDTO)  // 각 Community 객체를 CommunityDTO로 변환
                .collect(Collectors.toList());  // 변환된 CommunityDTO 객체들을 리스트로 모음
    }

    public static Slice<CommunityDTO> toDTO(Slice<Community> communities) {
        return communities.map(CommunityDTO::toDTO);  // 정상적으로 CommunityDTO로 변환
    }
}
