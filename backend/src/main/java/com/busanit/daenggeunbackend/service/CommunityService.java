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

    public CommunityDTO update(String id, CommunityDTO communityDTO) {
        Community community = communityRepository.findById(id).orElseThrow(() -> new RuntimeException("Community not found"));
        community.setTitle(communityDTO.getTitle());
        community.setContent(communityDTO.getContent());
        community.setImages(communityDTO.getImages());
        community.setCategory(communityDTO.getCategory());

        Community updatedCommunity = communityRepository.save(community);
        return CommunityDTO.toDTO(updatedCommunity);
    }

    public void delete(String id) {
        communityRepository.deleteById(id);
    }

}
