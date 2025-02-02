package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.Alba;
import com.busanit.daenggeunbackend.service.AlbaService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 주소로 변경
@RestController
@RequestMapping("/api/alba")
@Log4j2
public class AlbaController {

    private final AlbaService albaService;

    public AlbaController(AlbaService albaService) {
        this.albaService = albaService;
    }

    // 모든 알바 데이터 가져오기
    @GetMapping
    public List<Alba> getAllAlba(@RequestParam(required = false) String start,  // start 값 받기
                                 @RequestParam(required = false) String end) {   // end 값 받기

        return albaService.getAllAlba(start, end);
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

    // 검색데이터 가져오기
    @GetMapping("/search")
    public ResponseEntity<List<Alba>> searchAlba(
        @RequestParam(required = false) String sigungu,
        @RequestParam(required = false) String emd,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String searchTerm,
        @RequestParam(required = false) String workPeriod,
        @RequestParam(required = false) List<String> workDays,
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        try {
            List<Alba> results = albaService.searchAlba(
                sigungu, emd, category, searchTerm, 
                workPeriod, workDays, start, end, 
                page, size
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 알바 데이터 생성
    @PostMapping
    public ResponseEntity<Alba> createAlba(@RequestBody Alba alba) {
        log.info("POST 요청 처리@@@@@@@@@@@");
        if (alba.getCreatedAt() == null) {
            alba.setCreatedAt(LocalDateTime.now());
        }
        Alba createdAlba = albaService.createAlba(alba);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAlba);
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

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image file is missing");
        }

        try {
            // 이미지 파일 저장 경로 설정 (현재 디렉토리 내의 "uploads" 폴더)
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdir();
            }

            // 파일 이름 생성
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            File destination = new File(uploadDir + fileName);

            // 파일 저장
            image.transferTo(destination);

            // 이미지 URL 반환 (이 예시에서는 로컬 경로)
            String imageUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving image: " + e.getMessage());
        }
    }
    // 알바 데이터 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlba(@PathVariable String id) {
        albaService.deleteAlba(id);
        return ResponseEntity.ok("Alba deleted successfully");
    }


}
