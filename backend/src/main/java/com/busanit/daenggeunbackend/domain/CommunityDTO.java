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
    private String userId;
    private String title;
    private String content;
    private String location;
    private LocalDateTime createdDate;
    private List<Image> images;
    private int views;
    private List<String> bookmarksUsers;
    private List<String> likeUsers;
    private List<String> comments;
    private int likeCount; // 좋아요 수
    private int commentCount; // 댓글 수

    public static CommunityDTO toDTO(Community community) {
        CommunityDTOBuilder builder = CommunityDTO.builder();
        builder.id(community.getId());
        builder.userId(community.getUserId());
        builder.title(community.getTitle());
        builder.content(community.getContent());
        builder.location(community.getLocation());
        builder.createdDate(community.getCreatedDate());
        builder.images(community.getImages());
        builder.views(community.getViews());
        builder.bookmarksUsers(community.getBookmarkUsers());
        builder.likeUsers(community.getLikeUsers());
        builder.comments(community.getComments());
        return builder.build();
    }

    public static List<CommunityDTO> toDTO(List<Community> communities) {
        return communities.stream().map(CommunityDTO::toDTO).collect(Collectors.toList());
    }

    public static Slice<CommunityDTO> toDTO(Slice<Community> communities) { return communities.map(CommunityDTO::toDTO); }
}
