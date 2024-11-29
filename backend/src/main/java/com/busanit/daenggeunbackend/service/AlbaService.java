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
}