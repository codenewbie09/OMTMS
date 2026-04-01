package com.omtms.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long paymentId;
    private Long bookingId;
    private Double amount;
    private String paymentDate;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
}

@Data
class ProcessPaymentDTO {
    private Long bookingId;
    private String paymentMethod;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
}
