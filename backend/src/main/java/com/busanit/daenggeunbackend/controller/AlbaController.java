package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.service.AlbaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Alba> getAlbaById(@PathVariable String id) {
        Alba alba = albaService.getAlbaById(id);
        if (alba == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(alba);
    }

    // 알바 데이터 생성
    @PostMapping
    public ResponseEntity<Alba> createAlba(@RequestBody Alba alba) {
        Alba createdAlba = albaService.createAlba(alba);
        return ResponseEntity.ok(createdAlba);
    }

    // 알바 데이터 수정
    @PutMapping("/{id}")
    public ResponseEntity<Alba> updateAlba(@PathVariable String id, @RequestBody Alba alba) {
        Alba updatedAlba = albaService.updateAlba(id, alba);
        if (updatedAlba == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updatedAlba);
    }

    // 알바 데이터 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlba(@PathVariable String id) {
        albaService.deleteAlba(id);
        return ResponseEntity.ok("Alba deleted successfully");
    }
}
