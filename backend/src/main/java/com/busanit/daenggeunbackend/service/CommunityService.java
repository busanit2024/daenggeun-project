package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.entity.Community;
import com.busanit.daenggeunbackend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;

    public Page<CommunityDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Community> communityPage = communityRepository.findAll(pageable);
        return (Page<CommunityDTO>) CommunityDTO.toDTO(communityPage);
    }

    public static Page<CommunityDTO> toDTO(Page<Community> communities) {
        return communities.map(CommunityDTO::toDTO);
    }

    public void save(CommunityDTO communityDTO) {
        communityRepository.save(Community.toEntity(communityDTO));
    }

    public CommunityDTO findById(String id) {
        Community community = communityRepository.findById(id).orElse(null);
        if (community == null) {
            return null;
        }
        return CommunityDTO.toDTO(community);
    }

//    public CommunityDTO update(String id, CommunityDTO communityDTO) {
//        Community community = communityRepository.findById(id).orElseThrow(() -> new RuntimeException("Community not found"));
//        community.setTitle(communityDTO.getTitle());
//        community.setContent(communityDTO.getContent());
//        community.setImages(communityDTO.getImages());
//        community.setCategory(communityDTO.getCategory());
//
//        Community updatedCommunity = communityRepository.save(community);
//        return CommunityDTO.toDTO(updatedCommunity);
//    }

    public void update(CommunityDTO communityDTO) {
        communityRepository.save(Community.toEntity(communityDTO));
    }

    public void delete(String id) {
        communityRepository.deleteById(id);
    }

    public Slice<CommunityDTO> searchPage(String sigungu, String emd, String category, String searchTerm, Pageable pageable) {
        // 카테고리가 "all"일 때
        if (Objects.equals(category, "all")) {
            // 검색어가 있을 때
            if (searchTerm != null && !searchTerm.isEmpty()) {
                if (emd == null || emd.isEmpty()) {
                    // emd가 비어있을 경우 sigungu만으로 검색
                    Slice<Community> communities = communityRepository.findByLocationSigunguAndSearchTerm(sigungu, searchTerm, pageable);
                    return CommunityDTO.toDTO(communities);
                }
                // emd가 있을 경우
                Slice<Community> communities = communityRepository.findByLocationAndSearchTerm(sigungu, emd, searchTerm, pageable);
                return CommunityDTO.toDTO(communities);
            }
            // 검색어가 없을 때
            if (emd == null || emd.isEmpty()) {
                // emd가 비어있을 경우 sigungu만으로 검색
                Slice<Community> communities = communityRepository.findAllByLocationSigunguContainingOrderByCreatedDateDesc(sigungu, pageable);
                return CommunityDTO.toDTO(communities);
            }
            // emd가 있을 경우
            Slice<Community> communities = communityRepository.findAllByLocationSigunguContainingAndLocationEmdContainingOrderByCreatedDateDesc(sigungu, emd, pageable);
            return CommunityDTO.toDTO(communities);
        }

        // 카테고리가 있을 때
        if (searchTerm != null && !searchTerm.isEmpty()) {
            if (emd == null || emd.isEmpty()) {
                // emd가 비어있을 경우 sigungu만으로 검색
                Slice<Community> communities = communityRepository.findByLocationSigunguAndCategoryAndSearchTerm(sigungu, category, searchTerm, pageable);
                return CommunityDTO.toDTO(communities);
            }
            // emd가 있을 경우
            Slice<Community> communities = communityRepository.findByLocationAndCategoryAndSearchTerm(sigungu, emd, category, searchTerm, pageable);
            return CommunityDTO.toDTO(communities);
        }

        // 검색어 없이 카테고리만 있을 때
        if (emd == null || emd.isEmpty()) {
            // emd가 비어있을 경우 sigungu만으로 검색
            Slice<Community> communities = communityRepository.findAllByLocationSigunguContainingAndCategoryOrderByCreatedDateDesc(sigungu, category, pageable);
            return CommunityDTO.toDTO(communities);
        }

        // emd가 있을 경우
        Slice<Community> communities = communityRepository.findAllByLocationSigunguContainingAndLocationEmdContainingAndCategoryOrderByCreatedDateDesc(sigungu, emd, category, pageable);
        return CommunityDTO.toDTO(communities);
    }

    public Slice<CommunityDTO> findByUserId(String userId, Pageable pageable) {
        Slice<Community> communities = communityRepository.findByUserId(userId, pageable);
        return CommunityDTO.toDTO(communities);
    }
}
