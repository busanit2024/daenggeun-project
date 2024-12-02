package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.service.CommunityServiece;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityServiece communityServiece;

    @GetMapping
    public ResponseEntity<List<CommunityDTO>> getAllCommunities() {
        List<CommunityDTO> communities = communityServiece.getAllCommunities();
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDTO> getCommunityById(@PathVariable String id) {
        CommunityDTO community = communityServiece.getCommunityById(id);
        return ResponseEntity.ok(community);
    }

    @PostMapping
    public ResponseEntity<CommunityDTO> createCommunity(@RequestBody CommunityDTO communityDTO) {
        CommunityDTO createdCommunity = communityServiece.createCommunity(communityDTO);
        return ResponseEntity.status(201).body(createdCommunity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityDTO> updateCommunity(@PathVariable String id, @RequestBody CommunityDTO communityDTO) {
        CommunityDTO updatedCommunity = communityServiece.updateCommunity(id, communityDTO);
        return ResponseEntity.ok(updatedCommunity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable String id) {
        communityServiece.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Void> addComment(@PathVariable String id, @RequestBody String comment) {
        communityServiece.addComment(id, comment);
        return ResponseEntity.ok().build(); // 댓글 추가 성공
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<Void> addLike(@PathVariable String id, @RequestParam String userId) {
        communityServiece.addLike(id, userId);
        return ResponseEntity.ok().build(); // 좋아요 추가 성공
    }

    @PostMapping("/{id}/bookmarks")
    public ResponseEntity<Void> addBookmark(@PathVariable String id, @RequestParam String userId) {
        communityServiece.addBookmark(id, userId);
        return ResponseEntity.ok().build(); // 북마크 추가 성공
    }

    @DeleteMapping("/{id}/bookmarks")
    public ResponseEntity<Void> removeBookmark(@PathVariable String id, @RequestParam String userId) {
        communityServiece.removeBookmark(id, userId);
        return ResponseEntity.ok().build(); // 북마크 제거 성공
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity<Void> removeLike(@PathVariable String id, @RequestParam String userId) {
        communityServiece.removeLike(id, userId);
        return ResponseEntity.ok().build(); // 좋아요 제거 성공
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDTO> getCommunityDetails(@PathVariable String id) {
        CommunityDTO communityDTO = communityServiece.getCommunityDetails(id);
        return ResponseEntity.ok(communityDTO); // 게시글 상세 정보 반환
    }
}
