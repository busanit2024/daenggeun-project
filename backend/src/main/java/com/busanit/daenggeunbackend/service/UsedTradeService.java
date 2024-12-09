package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.repository.UsedTradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.plaf.ListUI;
import java.util.List;

@Service
public class UsedTradeService {
    @Autowired
    private UsedTradeRepository usedTradeRepository;

    public UsedTrade createUsedTrade(UsedTrade usedTrade) {
        return usedTradeRepository.save(usedTrade);
    }

    public List<UsedTrade> getAllUsedTrade() {
        return usedTradeRepository.findAll();
    }

    public UsedTrade getUsedTradeById(String id) {
        return usedTradeRepository.findById(id).orElse(null);
    }

    public UsedTrade updatedUsedTrade(UsedTrade updatedUsedTrade) {
        return usedTradeRepository.save(updatedUsedTrade);
    }

    public boolean deleteUsedTradeById(String id) {
        if (usedTradeRepository.existsById(id)) {
            usedTradeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 검색 결과
    public List<UsedTrade> searchUsedTrades(String keyword) {
        return usedTradeRepository.findByContentContainingOrNameContaining(keyword, keyword);
    }

    
}