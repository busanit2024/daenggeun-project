package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.domain.Image;
import com.busanit.daenggeunbackend.entity.FilterData;
import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.service.FilterDataService;
import com.busanit.daenggeunbackend.service.UsedTradeService;
import jakarta.servlet.Filter;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/usedTrades")
public class UsedTradeController {
    @Autowired
    private UsedTradeService usedTradeService;

    @Autowired
    private FilterDataService filterDataService;

    @PostMapping
    public ResponseEntity<UsedTrade> createUsedTrade(
            @RequestBody UsedTrade usedTrade,
            @RequestParam("images") MultipartFile imageFile) {
        System.out.println("Received POST request with data: " + usedTrade);
        usedTrade.setTradeable(true);
        UsedTrade createdUsedTrade = usedTradeService.createUsedTrade(usedTrade, imageFile);
        return ResponseEntity.ok(createdUsedTrade);
    }

    @GetMapping
    public ResponseEntity<List<UsedTrade>> getUsedTrades(@RequestParam(required = false) String category,
                                                         @RequestParam(required = false) String sort,
                                                         @RequestParam(required = false) Boolean tradeable) {
        List<UsedTrade> usedTradeList = usedTradeService.getUsedTrades(category, sort, tradeable);
        return ResponseEntity.ok(usedTradeList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsedTrade> getUsedTradeById(@PathVariable String id) {
        UsedTrade usedTrade = usedTradeService.getUsedTradeById(id);
        if (usedTrade != null) {
            return ResponseEntity.ok(usedTrade);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsedTrade> updateUsedTrade(@PathVariable String id,
                                                     @RequestBody UsedTrade updatedUsedTrade) {
        System.out.println("Received PUT request for ID: " + id + " with data: " + updatedUsedTrade);
        UsedTrade existingTrade = usedTradeService.getUsedTradeById(id);
        if (existingTrade != null) {
            updatedUsedTrade.setId(id);
            UsedTrade savedUsedTrade = usedTradeService.updatedUsedTrade(updatedUsedTrade);
            return ResponseEntity.ok(savedUsedTrade);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsedTrade(@PathVariable String id) {
        System.out.println("Received DELETE request for ID: " + id);
        boolean isDeleted = usedTradeService.deleteUsedTradeById(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //검색 결과
    @GetMapping("/search")
    public ResponseEntity<List<UsedTrade>> searchUsedTrade(@RequestParam String keyword) {
        List<UsedTrade> filteredTrades = usedTradeService.searchUsedTrades(keyword);
        return ResponseEntity.ok(filteredTrades);
    }

    @GetMapping("/data/filter")
    public ResponseEntity<FilterDataDTO> getFilterData(@RequestParam String name) {
        FilterDataDTO filterDataDTO = filterDataService.findByName(name);
        if (filterDataDTO != null) {
            return ResponseEntity.ok(filterDataDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/images")
    public ResponseEntity<List<Image>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        List<Image> images = new ArrayList<>();
        String uploadDir = "uploads/"; // 파일 저장 경로

        for (MultipartFile file : files) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            try {
                file.transferTo(dest); // 파일 저장

                // Image 객체 생성 및 설정
                Image image = new Image();
                image.setFilename(fileName); // 파일 이름 설정
                image.setFilePath(dest.getAbsolutePath()); // 서버 내 파일 경로 설정
                image.setUrl("/uploads/" + fileName); // 클라이언트에서 접근할 URL 설정
                images.add(image); // 리스트에 추가
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        return ResponseEntity.ok(images); // Image 객체 리스트 반환
    }

}
