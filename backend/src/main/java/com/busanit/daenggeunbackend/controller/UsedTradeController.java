package com.busanit.daenggeunbackend.controller;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.service.UsedTradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UsedTradeController {
    @Autowired
    private UsedTradeService usedTradeService;

    @PostMapping
    public ResponseEntity<UsedTrade> createUsedTrade(@RequestBody UsedTrade usedTrade) {
        UsedTrade createdUsedTrade = usedTradeService.createUsedTrade(usedTrade);
        return ResponseEntity.ok(createdUsedTrade);
    }

    // 나중에 추가하기
}
