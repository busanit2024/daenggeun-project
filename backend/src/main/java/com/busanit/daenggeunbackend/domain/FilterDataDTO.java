package com.busanit.daenggeunbackend.domain;

import com.busanit.daenggeunbackend.entity.FilterData;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FilterDataDTO {
  private String id;
  private String name;
  private List<FilterData.Filter> filters;
  private List<FilterData.LocationFilter> locationFilters;

  public static FilterDataDTO toDTO(FilterData filterData) {
    FilterDataDTOBuilder builder = FilterDataDTO.builder()
            .id(filterData.getId())
            .name(filterData.getName())
            .filters(filterData.getFilters())
            .locationFilters(filterData.getLocationFilters());
    return builder.build();
  }
}
