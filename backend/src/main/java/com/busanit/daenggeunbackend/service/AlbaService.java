package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.repository.AlbaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbaService {
    @Autowired
    private AlbaRepository albaRepository;

    public List<Alba> getAllAlba() {
        return albaRepository.findAll();
    }

    public Alba createAlba(Alba alba) {
        return albaRepository.save(alba);
    }

    public Alba updateAlba(String id, Alba alba) {
        Alba existingAlba = albaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alba not found"));
        // 기존 데이터의 필드 중 필요한 부분을 업데이트합니다.
        existingAlba.setTitle(alba.getTitle());
        existingAlba.setDescription(alba.getDescription());
        existingAlba.setWage(alba.getWage());
        existingAlba.setWorkDays(alba.getWorkDays());
        existingAlba.setWorkTime(alba.getWorkTime());
        // 필요한 필드들을 수정할 수 있습니다.

        return albaRepository.save(existingAlba);
    }

    public void deleteAlba(String id) {
        albaRepository.deleteById(id);
    }

    public Alba getAlbaById(String id) {
        return albaRepository.findById(id).orElseThrow(() -> new RuntimeException("Alba not found"));
    }
}