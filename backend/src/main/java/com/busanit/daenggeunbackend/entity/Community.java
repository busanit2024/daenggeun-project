package com.busanit.daenggeunbackend.entity;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.domain.Image;
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
    private String userId;
    private String title;
    private String content;
    private String Location;
    private List<Image> images;
    private int views;
    private String description;
    private String category;
    private List<String> bookmarkUsers;
    private List<String> likeUsers;
    private List<String> comments;

    @CreatedDate
    private LocalDateTime createdDate;

    public int getCommentsCount() {
        return comments.size();
    }

    public int getLikeUsersCount() {
        return likeUsers.size();
    }

    public void addBookmarkUser(String userId) {
        if (!bookmarkUsers.contains(userId)) {
            bookmarkUsers.add(userId);
        }
    }

    public void removeBookmarkUser(String userId) {
        bookmarkUsers.remove(userId);
    }

    public void addLikeUser(String userId) {
        if (!likeUsers.contains(userId)) {
            likeUsers.add(userId);
        }
    }

    public void removeLikeUser(String userId) {
        likeUsers.remove(userId);
    }

    public static Community toEntity(CommunityDTO communityDTO) {
        CommunityBuilder builder = Community.builder()
                .title(communityDTO.getTitle())
                .content(communityDTO.getContent())
                .description(communityDTO.getDescription())
                .Location(communityDTO.getLocation())
                .images(communityDTO.getImages())
                .views(0)
                .category(communityDTO.getCategory())
                .category(communityDTO.getCategory())
                .bookmarkUsers(communityDTO.getBookmarkUsers())
                .likeUsers(communityDTO.getLikeUsers())
                .comments(communityDTO.getComments());
        if (communityDTO.getId() != null) {
            builder.id(communityDTO.getId());
        }
        return builder.build();
    }
}
