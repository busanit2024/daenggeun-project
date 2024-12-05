package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.entity.FilterData;
import com.busanit.daenggeunbackend.repository.FilterDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilterDataService {
  private final FilterDataRepository filterDataRepository;

  public FilterDataDTO findByName(String name) {
    FilterData filterData = filterDataRepository.findByName(name);
    return FilterDataDTO.toDTO(filterData);
  }

}
