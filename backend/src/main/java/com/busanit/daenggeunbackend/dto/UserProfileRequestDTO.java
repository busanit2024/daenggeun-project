package com.busanit.daenggeunbackend.dto;

import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.domain.Location;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserProfileRequestDTO {
    private String id;
    private String uid;
    private String username;
    private List<LocationDTO> userLocation;
    private Image profileImage;
}