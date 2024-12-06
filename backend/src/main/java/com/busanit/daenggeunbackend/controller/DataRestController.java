package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.entity.FilterData;
import com.busanit.daenggeunbackend.service.FilterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/data")
public class DataRestController {
  private final FilterDataService filterDataService;

  @GetMapping("/filter")
  private FilterDataDTO getFilterData(@RequestParam(value = "name") String name) {
    return filterDataService.findByName(name);
  }

  @GetMapping("/filter-data")
  public List<FilterDataDTO> getFilterDataList() {
    return filterDataService.findAll(); // 모든 필터 데이터를 반환하는 메서드
  }

}
