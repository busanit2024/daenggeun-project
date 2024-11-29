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
        alba.setId(id);
        return albaRepository.save(alba);
    }

    public void deleteAlba(String id) {
        albaRepository.deleteById(id);
    }

    public Alba getAlbaById(String id) {
        return albaRepository.findById(id).orElseThrow(() -> new RuntimeException("Alba not found"));
    }
}