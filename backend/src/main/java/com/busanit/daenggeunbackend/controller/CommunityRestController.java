package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityRestController {
    private final CommunityService communityService;

    @GetMapping("list")
    private Page<CommunityDTO> getCommunities(Pageable pageable) {
        return communityService.findAll(pageable.getPageNumber(), pageable.getPageSize());
    }

    @PostMapping("/save")
    public void saveCommunity(@RequestBody CommunityDTO communityDTO) { communityService.save(communityDTO); }

    @GetMapping("/view/{communityId}")
    private CommunityDTO getCommunity(@PathVariable String communityId) { return communityService.findById(communityId); }

    @PutMapping("/update/{communityId}")
    public CommunityDTO updateCommunity(@PathVariable String communityId, @RequestBody CommunityDTO communityDTO) {
        return communityService.update(communityId, communityDTO);
    }

    @DeleteMapping("/delete/{communityId}")
    public void deleteCommunity(@PathVariable String communityId) {
        communityService.delete(communityId);
    }

    @GetMapping("/search")
    private Slice<CommunityDTO> searchCommunities(@RequestParam String sigungu,
                                                  @RequestParam(required = false) String emd,
                                                  @RequestParam String category,
                                                  @RequestParam String searchTerm,
                                                  @RequestParam int page,
                                                  @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return communityService.searchPage(sigungu, emd != null ? emd : "", category, searchTerm, pageable);
    }

}
