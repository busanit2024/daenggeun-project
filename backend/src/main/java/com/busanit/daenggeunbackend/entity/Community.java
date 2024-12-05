package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.domain.Image;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Community {

    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private String location;
    private LocalDateTime createdDate;
    private List<Image> images;
    private int views;
    private List<String> bookmarkUsers;
    private List<String> likeUsers;
    private List<String> comments;

    public static Community toEntity(CommunityDTO communityDTO) {
        CommunityBuilder builder = Community.builder()
                .title(communityDTO.getTitle())
                .content(communityDTO.getContent())
                .location(communityDTO.getLocation())
                .createdDate(communityDTO.getCreatedDate())
                .images(communityDTO.getImages())
                .views(communityDTO.getViews())
                .bookmarkUsers(communityDTO.getBookmarksUsers())
                .likeUsers(communityDTO.getLikeUsers())
                .comments(communityDTO.getComments());
        if (communityDTO.getId() != null) {
            builder.id(communityDTO.getId());
        }
        return builder.build();
    }

}
