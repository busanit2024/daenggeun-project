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
}
