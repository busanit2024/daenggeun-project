package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.repository.AlbaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbaService {
    private final AlbaRepository albaRepository;

    @Autowired
    public AlbaService(AlbaRepository albaRepository) {
        this.albaRepository = albaRepository;
    }

    public List<Alba> getAllAlba(String start, String end) {
        // return albaRepository.findAll();
        // 필터링 조건 처리
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");


        return albaRepository.findAll().stream()
                .filter(alba -> start == null || (
                        alba.getWorkTime() != null &&
                                ( LocalTime.parse(start, formatter).equals(LocalTime.parse(alba.getWorkTime().getStart(), formatter)) ||
                                LocalTime.parse(start, formatter).isBefore(LocalTime.parse(alba.getWorkTime().getStart(), formatter)))// start 이전인지 확인
                ))
                .filter(alba -> end == null || (
                        alba.getWorkTime() != null &&
                                (LocalTime.parse(end, formatter).equals(LocalTime.parse(alba.getWorkTime().getEnd(), formatter)) ||
                                LocalTime.parse(end, formatter).isAfter(LocalTime.parse(alba.getWorkTime().getEnd(), formatter)))    // end 이후인지 확인
                ))
                .collect(Collectors.toList());
    }

    public Alba createAlba(Alba alba) {
        return albaRepository.save(alba);
    }

    public Alba updateAlba(String id, Alba alba) {
        return albaRepository.save(alba);
    }

    public void deleteAlba(String id) {
        albaRepository.deleteById(id);
    }

    public Alba getAlbaById(String id) {
        return albaRepository.findById(id).orElse(null);
    }

}

