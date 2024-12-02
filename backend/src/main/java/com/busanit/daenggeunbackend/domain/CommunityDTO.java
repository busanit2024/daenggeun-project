package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.Community;
import lombok.*;

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
    private String title;
    private String content;
    private String Location;
    private List<Image> images;
    private int views;
    private String description;
    private String category;
    private LocalDateTime createdDate;
    private List<String> bookmarkUsers;
    private List<String> likeUsers;
    private List<String> comments;

    public static CommunityDTO toDTO(Community community) {
        CommunityDTOBuilder builder = CommunityDTO.builder();
        builder.id(community.getId());
        builder.title(community.getTitle());
        builder.content(community.getContent());
        builder.Location(community.getLocation());
        builder.images(community.getImages());
        builder.views(community.getViews());
        builder.description(community.getDescription());
        builder.category(community.getCategory());
        builder.createdDate(community.getCreatedDate());
        builder.bookmarkUsers(community.getBookmarkUsers());
        builder.likeUsers(community.getLikeUsers());
        builder.comments(community.getComments());
        return builder.build();
    }

    public static List<CommunityDTO> toDTO(List<Community> communities) {
        return communities.stream().map(CommunityDTO::toDTO).collect(Collectors.toList());
    }
}
