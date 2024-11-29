package com.busanit.daenggeunbackend.controller;


import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.service.AlbaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AlbaController {
    @Autowired
    private AlbaService albaService;

    @GetMapping("/api/alba")
    public List<Alba> getAllAlba() {
        return albaService.getAllAlba();
    }
}