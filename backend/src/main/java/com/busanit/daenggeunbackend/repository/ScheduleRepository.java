package com.busanit.daenggeunbackend.repository;

import com.busanit.daenggeunbackend.domain.ScheduleDTO;
import com.busanit.daenggeunbackend.entity.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {
  Slice<Schedule> findByGroupIdAndClosed(String groupId, boolean closed, Pageable pageable);
}
