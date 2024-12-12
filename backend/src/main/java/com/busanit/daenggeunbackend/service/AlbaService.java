package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.repository.AlbaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public List<Alba> searchAlba(
        String sigungu, String emd, String category, 
        String searchTerm, String workPeriod, 
        List<String> workDays, String start, String end,
        int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        List<Alba> results;

        // 1. 지역 기반 기본 필터링 (필수)
        if (sigungu != null) {
            if (emd != null && !emd.isEmpty()) {
                results = albaRepository.findByLocationSigunguContainingAndLocationEmdContaining(
                    sigungu, emd, pageable);
            } else {
                results = albaRepository.findByLocationSigunguContaining(sigungu, pageable);
            }
        } else {
            results = albaRepository.findAll(pageable).getContent();
        }

        // 2. 추가 필터링 (선택)
        // 카테고리 필터
        if (category != null && !category.equals("all")) {
            results = results.stream()
                .filter(alba -> alba.getCategory().equals(category))
                .collect(Collectors.toList());
        }

        // 검색어 필터 (제목 + 내용)
        if (searchTerm != null && !searchTerm.isEmpty()) {
            results = results.stream()
                .filter(alba -> 
                    alba.getTitle().contains(searchTerm) || 
                    (alba.getDescription() != null && alba.getDescription().contains(searchTerm)))
                .collect(Collectors.toList());
        }

        // 근무 기간 필터
        if (workPeriod != null) {
            results = results.stream()
                .filter(alba -> alba.getWorkPeriod().equals(workPeriod))
                .collect(Collectors.toList());
        }

        // 근무 요일 필터
        if (workDays != null && !workDays.isEmpty()) {
            results = results.stream()
                .filter(alba -> 
                    alba.getWorkDays() != null && 
                    alba.getWorkDays().containsAll(workDays))
                .collect(Collectors.toList());
        }

        // 근무 시간 필터
        if (start != null && end != null) {
            results = results.stream()
                .filter(alba -> {
                    if (alba.getWorkTime() == null) return false;
                    String albaStart = alba.getWorkTime().getStart();
                    String albaEnd = alba.getWorkTime().getEnd();
                    return albaStart != null && albaEnd != null &&
                           albaStart.compareTo(start) >= 0 && 
                           albaEnd.compareTo(end) <= 0;
                })
                .collect(Collectors.toList());
        }

        return results;
    }

}

