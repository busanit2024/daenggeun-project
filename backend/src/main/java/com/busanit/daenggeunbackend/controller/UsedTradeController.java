package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.service.UsedTradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usedTrades")
public class UsedTradeController {
    @Autowired
    private UsedTradeService usedTradeService;

    @PostMapping
    public ResponseEntity<UsedTrade> createUsedTrade(@RequestBody UsedTrade usedTrade) {
        System.out.println("Received POST request with data: " + usedTrade);
        UsedTrade createdUsedTrade = usedTradeService.createUsedTrade(usedTrade);
        return ResponseEntity.ok(createdUsedTrade);
    }

    @GetMapping
    public ResponseEntity<List<UsedTrade>> getAllUsedTrade() {
        List<UsedTrade> usedTradeList = usedTradeService.getAllUsedTrade();
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
}
