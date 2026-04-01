package com.omtms.dto;

import lombok.Data;

@Data
public class RefundConfigDTO {
    private Double refundPercent24h = 0.80;
    private Double refundPercent4h = 0.50;
    private Double refundPercentUnder4h = 0.0;
    private Double bulkDiscountThreshold = 5.0;
    private Double bulkDiscountPercent = 0.10;
    private Double loyaltyDiscountPercent = 0.15;
}
