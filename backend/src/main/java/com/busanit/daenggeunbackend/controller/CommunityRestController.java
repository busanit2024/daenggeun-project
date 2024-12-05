package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.CommunityDTO;
import com.busanit.daenggeunbackend.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityRestController {
    private final CommunityService communityService;

    @GetMapping("/list")
    public Slice<CommunityDTO> getCommunities(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return communityService.findAll(page, size);
    }

    @GetMapping("/view/{communityId}")
    public CommunityDTO getCommunity(@PathVariable String communityId) {
        return communityService.findById(communityId);
    }

    @GetMapping("/by-location-and-category")
    public Slice<CommunityDTO> getByLocationAndCategory(@RequestParam String sigungu, @RequestParam String emd, @RequestParam String category,
                                                         @RequestParam(defaultValue = "0") int page, 
                                                         @RequestParam(defaultValue = "10") int size) {
        return communityService.findByLocationAndCategory(sigungu, emd, category, page, size);
    }

    @GetMapping("/popular")
    public Slice<CommunityDTO> getPopularPosts(@RequestParam String sigungu, @RequestParam String emd,
                                               @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        return communityService.findPopularPosts(sigungu, emd, page, size);
    }

    @GetMapping("/by-location")
    public Slice<CommunityDTO> getAllByLocation(@RequestParam String sigungu, @RequestParam String emd,
                                                 @RequestParam(defaultValue = "0") int page, 
                                                 @RequestParam(defaultValue = "10") int size) {
        return communityService.findAllByLocation(sigungu, emd, page, size);
    }

    @PostMapping("/wirte")
    public CommunityDTO writeCommunity(@RequestBody CommunityDTO communityDTO) {
        return communityService.writeCommunity(communityDTO);
    }

    @PutMapping("/update/{communityId}")
    public CommunityDTO updateCommunity(@PathVariable String communityId, @RequestBody CommunityDTO communityDTO) {
        return communityService.updateCommunity(communityId, communityDTO);
    }

    @DeleteMapping("/delete/{communityId}")
    public void deleteCommunity(@PathVariable String communityId) {
        communityService.deleteCommunity(communityId);
    }
}