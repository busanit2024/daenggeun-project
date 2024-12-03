package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.repository.UsedTradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsedTradeService {
    @Autowired
    private UsedTradeRepository usedTradeRepository;

    public UsedTrade createUsedTrade(UsedTrade usedTrade) {
        return usedTradeRepository.save(usedTrade);
    }

    
}