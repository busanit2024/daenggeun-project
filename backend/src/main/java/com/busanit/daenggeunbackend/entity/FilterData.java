package com.busanit.daenggeunbackend.entity;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
@Setter
@Builder
public class FilterData {
  @Id
  private String id;
  private String name;
  private List<Filter> filters;
  private List<LocationFilter> locationFilters;

  @Data
  public static class Filter {
    private String name;
    private String value;
    private String label;
  }

  @Data
  public static class LocationFilter {
    private String sigungu;
    private List<Emd> emd;

    @Data
    public static class Emd {
      private String emd;
      private List<String> li;
    }
  }


}

