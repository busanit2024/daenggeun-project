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
  private List<Filter> filters;

  public static FilterDataDTO toDTO(FilterData filterData) {
    FilterDataDTOBuilder builder = FilterDataDTO.builder()
            .id(filterData.getId())
            .name(filterData.getName())
            .filters(filterData.getFilters());
    return builder.build();
  }
}
