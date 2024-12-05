package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.entity.Community;
import com.busanit.daenggeunbackend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;

    public Slice<CommunityDTO> findAll(int page, int size) {
        Slice<Community> communities = communityRepository.findAll(PageRequest.of(page, size));
        return CommunityDTO.toDTO(communities);
    }

    public CommunityDTO findById(String id) {
        return communityRepository.findById(id)
                .map(CommunityDTO::toDTO)
                .orElse(null);
    }

    public CommunityDTO writeCommunity(CommunityDTO communityDTO) {
        Community community = Community.toEntity(communityDTO);
        community = communityRepository.save(community);
        return CommunityDTO.toDTO(community);
    }

    public CommunityDTO updateCommunity(String communityId, CommunityDTO communityDTO) {
        Optional<Community> optionalCommunity = communityRepository.findById(communityId);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            // 필요한 필드 업데이트
            community.setTitle(communityDTO.getTitle());
            community.setContent(communityDTO.getContent());
            community.setLocation(communityDTO.getLocation());
            community.setImages(communityDTO.getImages());
            // 추가적인 필드 업데이트
            community = communityRepository.save(community);
            return CommunityDTO.toDTO(community);
        }
        return null; // 또는 예외 처리
    }

    public void deleteCommunity(String communityId) {
        communityRepository.deleteById(communityId);
    }

    // 동네와 카테고리에 따라 커뮤니티를 작성일 기준 내림차순으로 가져오기
    public Slice<CommunityDTO> findByLocationAndCategory(String sigungu, String emd, String category, int page, int size) {
        Slice<Community> communities = communityRepository.findAllByLocationContainingAndCategoryOrderByCreatedDateDesc(sigungu, emd, category, PageRequest.of(page, size));
        return CommunityDTO.toDTO(communities);
    }

    // 인기글: 조회수 기준으로 가져오기
    public Slice<CommunityDTO> findPopularPosts(String sigungu, String emd, int page, int size) {
        Slice<Community> communities = communityRepository.findAllByOrderByViewsDesc(sigungu, emd, PageRequest.of(page, size));
        return CommunityDTO.toDTO(communities);
    }

    // 전체 카테고리: 동네별 작성일 기준 내림차순으로 가져오기
    public Slice<CommunityDTO> findAllByLocation(String sigungu, String emd, int page, int size) {
        Slice<Community> communities = communityRepository.findAllByLocationContainingOrderByCreatedDateDesc(sigungu, emd, PageRequest.of(page, size));
        return CommunityDTO.toDTO(communities);
    }
}