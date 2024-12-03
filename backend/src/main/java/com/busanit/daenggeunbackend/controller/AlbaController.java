package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.service.AlbaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alba")
public class AlbaController {

    @Autowired
    private AlbaService albaService;

    // 모든 알바 데이터 가져오기
    @GetMapping
    public List<Alba> getAllAlba() {
        return albaService.getAllAlba();
    }

    // 특정 알바 데이터 가져오기
    @GetMapping("/{id}")
    public Alba getAlbaById(@PathVariable String id) {
        return albaService.getAlbaById(id);
    }

    // 알바 데이터 생성
    @PostMapping
    public ResponseEntity<Alba> createAlba(@RequestBody Alba alba) {
        Alba createdAlba = albaService.createAlba(alba);
        return ResponseEntity.ok(createdAlba);
    }

    // 알바 데이터 수정
    @PutMapping("/{id}")
    public Alba updateAlba(@PathVariable String id, @RequestBody Alba alba) {
        return albaService.updateAlba(id, alba);
    }

    // 알바 데이터 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlba(@PathVariable String id) {
        albaService.deleteAlba(id);
        return ResponseEntity.ok("Alba deleted successfully");
    }
}
