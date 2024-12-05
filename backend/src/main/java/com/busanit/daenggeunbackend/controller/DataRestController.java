package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.entity.FilterData;
import com.busanit.daenggeunbackend.service.FilterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
  public List<FilterData> getAllFilterData() {
    return filterDataService.getAllFilterData();
  }

  @GetMapping("/filter-data/{id}")
  public FilterData getFilterDataById(@PathVariable String id) {
    return filterDataService.getFilterDataById(id);
  }

  @PostMapping("/filter-data")
  public void saveFilterData(@RequestBody FilterData filterData) {
    filterDataService.saveFilterData(filterData);
  }
}
