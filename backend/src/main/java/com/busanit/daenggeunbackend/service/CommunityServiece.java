package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.entity.Community;
import com.busanit.daenggeunbackend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityServiece {
    private final CommunityRepository communityRepository;

    // 모든 게시글 조회
    public List<CommunityDTO> getAllCommunities() {
        List<Community> communities = communityRepository.findAll();
        return communities.stream()
                .map(CommunityDTO::toDTO)
                .collect(Collectors.toList());
    }

    // 특정 게시글 조회
    public CommunityDTO getCommunityById(String id) {
        Community community = communityRepository.findById(id).orElseThrow();
        return CommunityDTO.toDTO(community);
    }

    // 게시글 생성
    public CommunityDTO createCommunity(CommunityDTO communityDTO) {
        Community community = Community.toEntity(communityDTO);
        Community savedCommunity = communityRepository.save(community);
        return CommunityDTO.toDTO(savedCommunity);
    }

    // 게시글 수정
    public CommunityDTO updateCommunity(String id, CommunityDTO communityDTO) {
        Community existingCommunity = communityRepository.findById(id).orElseThrow();
        existingCommunity.setTitle(communityDTO.getTitle());
        existingCommunity.setContent(communityDTO.getContent());
        existingCommunity.setDescription(communityDTO.getDescription());
        existingCommunity.setLocation(communityDTO.getLocation());
        existingCommunity.setImages(communityDTO.getImages());
        existingCommunity.setCategory(communityDTO.getCategory());
        // 추가적으로 필요한 필드 업데이트
        Community updatedCommunity = communityRepository.save(existingCommunity);
        return CommunityDTO.toDTO(updatedCommunity);
    }

    // 게시글 삭제
    public void deleteCommunity(String id) {
        communityRepository.deleteById(id);
    }

    public void addComment(String communityId, String comment) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        community.getComments().add(comment); // 댓글 추가
        communityRepository.save(community);
    }

    public void addLike(String communityId, String userId) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        community.addLikeUser(userId); // 좋아요 추가
        communityRepository.save(community);
    }

    public void addBookmark(String communityId, String userId) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        community.addBookmarkUser(userId); // 북마크 추가
        communityRepository.save(community);
    }

    public void removeBookmark(String communityId, String userId) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        community.removeBookmarkUser(userId); // 북마크 제거
        communityRepository.save(community);
    }

    public void removeLike(String communityId, String userId) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        community.removeLikeUser(userId); // 좋아요 제거
        communityRepository.save(community);
    }

    public CommunityDTO getCommunityDetails(String communityId) {
        Community community = communityRepository.findById(communityId).orElseThrow();
        return CommunityDTO.toDTO(community); // 게시글 상세 정보 반환
    }
}
