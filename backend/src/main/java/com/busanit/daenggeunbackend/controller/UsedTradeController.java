package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.domain.FilterDataDTO;
import com.busanit.daenggeunbackend.entity.FilterData;
import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.service.FilterDataService;
import com.busanit.daenggeunbackend.service.UsedTradeService;
import jakarta.servlet.Filter;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UsedTrade> createUsedTrade(@RequestBody UsedTrade usedTrade) {
        System.out.println("Received POST request with data: " + usedTrade);
        usedTrade.setTradeable(true);
        UsedTrade createdUsedTrade = usedTradeService.createUsedTrade(usedTrade);
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
}
