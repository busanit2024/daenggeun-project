package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.repository.UsedTradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.ListUI;
import java.io.IOException;
import java.util.List;

@Service
public class UsedTradeService {
    @Autowired
    private UsedTradeRepository usedTradeRepository;

    @Transactional
    public UsedTrade createUsedTrade(UsedTrade usedTrade, MultipartFile imageFile) {
        try {
            byte[] imageBytes = imageFile.getBytes();
            usedTrade.setImageData(imageBytes);
            return usedTradeRepository.save(usedTrade);
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
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

    public List<UsedTrade> getUsedTrades(String category, String sort, Boolean tradeable) {
        Sort sortOrder = null;

        if ("recent".equals(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "createdDate");
        } else if ("price".equals(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        }

        // 카테고리와 거래 가능 여부를 함께 필터링
        if (category != null && !category.isEmpty() && !category.equals("all")) {
            if (tradeable != null) {
                return usedTradeRepository.findByTradeableAndCategory(tradeable, category, sortOrder);
            } else {
                return usedTradeRepository.findByCategory(category, sortOrder);
            }
        } else if (tradeable != null) {
            // 카테고리가 지정되지 않았을 때 거래 가능 여부만 필터링
            return usedTradeRepository.findByTradeable(tradeable, sortOrder);
        }

        // 카테고리가 없거나 all인 경우 모든 중고 거래 데이터 반환
        return usedTradeRepository.findAll(sortOrder);
    }

    // 검색 결과
    public List<UsedTrade> searchUsedTrades(String keyword) {
        return usedTradeRepository.findByContentContainingOrNameContaining(keyword, keyword);
    }

    
}