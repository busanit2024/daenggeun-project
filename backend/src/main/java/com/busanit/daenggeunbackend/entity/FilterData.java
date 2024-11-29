package com.busanit.daenggeunbackend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.busanit.daenggeunbackend.domain.Filter;

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
}

