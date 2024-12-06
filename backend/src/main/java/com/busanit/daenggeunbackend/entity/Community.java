package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Community {
    @Id
    private String id;

    private String userId;  // 작성자 Id
    private String title; // 글 제목
    private String content;  // 글 내용
    private List<Image> images;  // 첨부된 이미지
    private Location location;
    private String category;
    private int views;  // 조회수
    private List<String> bookmarkUsers;  // 북마크한 유저들
    private List<String> likeUsers;  // 좋아요한 유저들
    private List<String> comments;  // 댓글 ID 목록

    @CreatedDate
    private LocalDateTime createdDate;

    public static Community toEntity(CommunityDTO communityDTO) {
        return Community.builder()
                .id(communityDTO.getId())
                .userId(communityDTO.getUserId())
                .title(communityDTO.getTitle())
                .content(communityDTO.getContent())
                .images(communityDTO.getImages())
                .location(communityDTO.getLocation())
                .category(communityDTO.getCategory())
                .views(communityDTO.getViews())
                .bookmarkUsers(communityDTO.getBookmarkUsers())
                .likeUsers(communityDTO.getLikeUsers())
                .comments(communityDTO.getComments())
                .createdDate(communityDTO.getCreatedDate())
                .build();
    }

}
