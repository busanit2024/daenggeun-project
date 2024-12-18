package com.busanit.daenggeunbackend.service;

import com.busanit.daenggeunbackend.entity.UsedTrade;
import com.busanit.daenggeunbackend.repository.UsedTradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageBytes = imageFile.getBytes();
                usedTrade.setImageData(imageBytes);
            } else {
                usedTrade.setImageData(null);
            }
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

    public List<UsedTrade> getUsedTrades(String sigungu, String emd, String category, String sort, Boolean tradeable) {
        Sort sortOrder = null;

        if ("recent".equals(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "createdDate");
        } else if ("price".equals(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        }

        // 지역과 카테고리, 거래 가능 여부를 함께 필터링
        if (sigungu != null && !sigungu.isEmpty()) {
            if (emd != null && !emd.isEmpty()) {
                // 구와 동이 모두 지정된 경���
                if (category != null && !category.isEmpty() && !category.equals("all")) {
                    if (tradeable != null) {
                        return usedTradeRepository.findByLocationAndTradeableAndCategory(
                            sigungu, emd, tradeable, category, sortOrder);
                    } else {
                        return usedTradeRepository.findByLocationAndCategory(
                            sigungu, emd, category, sortOrder);
                    }
                } else {
                    if (tradeable != null) {
                        return usedTradeRepository.findByLocationAndTradeable(
                            sigungu, emd, tradeable, sortOrder);
                    } else {
                        return usedTradeRepository.findByLocation(
                            sigungu, emd, sortOrder);
                    }
                }
            } else {
                // 구만 지정된 경우
                if (category != null && !category.isEmpty() && !category.equals("all")) {
                    if (tradeable != null) {
                        return usedTradeRepository.findBySigunguAndTradeableAndCategory(
                            sigungu, tradeable, category, sortOrder);
                    } else {
                        return usedTradeRepository.findBySigunguAndCategory(
                            sigungu, category, sortOrder);
                    }
                } else {
                    if (tradeable != null) {
                        return usedTradeRepository.findBySigunguAndTradeable(
                            sigungu, tradeable, sortOrder);
                    } else {
                        return usedTradeRepository.findBySigungu(sigungu, sortOrder);
                    }
                }
            }
        } else {
            // 지역이 지정되지 않은 경우 기존 로직 사용
            if (category != null && !category.isEmpty() && !category.equals("all")) {
                if (tradeable != null) {
                    return usedTradeRepository.findByTradeableAndCategory(tradeable, category, sortOrder);
                } else {
                    return usedTradeRepository.findByCategory(category, sortOrder);
                }
            } else if (tradeable != null) {
                return usedTradeRepository.findByTradeable(tradeable, sortOrder);
            }
        }

        // 아무 조건도 없는 경우 모든 데이터 반환
        return usedTradeRepository.findAll(sortOrder);
    }

    // 검색 결과
    public List<UsedTrade> searchUsedTrades(String keyword) {
        return usedTradeRepository.findByContentContainingOrNameContaining(keyword, keyword);
    }

    public Slice<UsedTrade> findByUserId(String userId, Pageable pageable) {
        return usedTradeRepository.findByUserId(userId, pageable);
    }

    public UsedTrade createUsedTradeWithoutImage(UsedTrade usedTrade) {
        return usedTradeRepository.save(usedTrade);
    }
}