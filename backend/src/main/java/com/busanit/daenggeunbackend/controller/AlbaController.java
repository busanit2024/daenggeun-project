package com.busanit.daenggeunbackend.controller;


import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.service.AlbaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alba")
public class AlbaController {
    @Autowired
    private AlbaService albaService;

    @GetMapping
    public List<Alba> getAllAlba() {
        return albaService.getAllAlbas();
    }

    @GetMapping("/{id}")
    public Alba getAlbaById(@PathVariable String id) {
        return albaService.getAlbaById(id);
    }

    @PostMapping
    public Alba createAlba(@RequestBody Alba alba) {
        return albaService.createAlba(alba);
    }

    @PutMapping("/{id}")
    public Alba updateAlba(@PathVariable String id, @RequestBody Alba alba) {
        return albaService.updateAlba(id, alba);
    }

    @DeleteMapping("/{id}")
    public void deleteAlba(@PathVariable String id) {
        albaService.deleteAlba(id);
    }
}