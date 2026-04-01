package com.omtms.controller;

import com.omtms.entity.Customer;
import com.omtms.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    private final CustomerRepository customerRepository;
    
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    @GetMapping("/{id}/loyalty")
    public ResponseEntity<Map<String, Object>> getCustomerLoyaltyInfo(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Map<String, Object> loyaltyInfo = new HashMap<>();
        loyaltyInfo.put("loyaltyId", customer.getLoyaltyId());
        loyaltyInfo.put("loyaltyPoints", customer.getLoyaltyPoints());
        loyaltyInfo.put("purchaseCount", customer.getPurchaseCount());
        loyaltyInfo.put("totalSpent", customer.getTotalSpent());
        loyaltyInfo.put("isLoyaltyMember", customer.getIsLoyaltyMember());
        
        String tier = "NONE";
        int points = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
        if (points >= 500) {
            tier = "PLATINUM (15% discount)";
        } else if (points >= 200) {
            tier = "GOLD (10% discount)";
        } else if (points >= 100) {
            tier = "SILVER (5% discount)";
        } else if (customer.getIsLoyaltyMember() != null && customer.getIsLoyaltyMember()) {
            tier = "BASIC (loyalty member)";
        }
        loyaltyInfo.put("loyaltyTier", tier);
        
        int pointsToNextTier = 0;
        if (points < 100) {
            pointsToNextTier = 100 - points;
            loyaltyInfo.put("nextTier", "SILVER (5% discount)");
        } else if (points < 200) {
            pointsToNextTier = 200 - points;
            loyaltyInfo.put("nextTier", "GOLD (10% discount)");
        } else if (points < 500) {
            pointsToNextTier = 500 - points;
            loyaltyInfo.put("nextTier", "PLATINUM (15% discount)");
        } else {
            loyaltyInfo.put("nextTier", "MAX TIER REACHED!");
        }
        loyaltyInfo.put("pointsToNextTier", pointsToNextTier);
        
        return ResponseEntity.ok(loyaltyInfo);
    }
}
