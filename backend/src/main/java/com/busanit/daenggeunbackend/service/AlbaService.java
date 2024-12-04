package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.repository.AlbaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbaService {
    private final AlbaRepository albaRepository;

    @Autowired
    public AlbaService(AlbaRepository albaRepository) {
        this.albaRepository = albaRepository;
    }

    public List<Alba> getAllAlba() {
        return albaRepository.findAll();
    }

    public Alba createAlba(Alba alba) {
        return albaRepository.save(alba);
    }

    public Alba updateAlba(String id, Alba alba) {
        Alba existingAlba = albaRepository.findById(id)
                .orElseThrow(() -> new ExpressionException("Alba with id " + id + " not found"));
        // 필요한 필드를 업데이트
        existingAlba.setTitle(alba.getTitle());
        existingAlba.setDescription(alba.getDescription());
        existingAlba.setWage(alba.getWage());
        existingAlba.setWorkDays(alba.getWorkDays());
        existingAlba.setWorkTime(alba.getWorkTime());

        return albaRepository.save(existingAlba);
    }

    public void deleteAlba(String id) {
        albaRepository.deleteById(id);
    }

    public Alba getAlbaById(String id) {
        return albaRepository.findById(id).orElse(null);
    }
}