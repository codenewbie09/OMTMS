package com.omtms.service;

import com.omtms.dto.PaymentDTO;
import com.omtms.entity.Booking;
import com.omtms.entity.Payment;
import com.omtms.repository.BookingRepository;
import com.omtms.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    
    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }
    
    @Transactional
    public PaymentDTO processPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is not in pending state");
        }
        
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        boolean paymentSuccess = processMockPayment(booking.getTotalAmount());
        
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(paymentSuccess ? "SUCCESS" : "FAILED");
        
        Payment savedPayment = paymentRepository.save(payment);
        
        if (paymentSuccess) {
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);
        }
        
        return toDTO(savedPayment);
    }
    
    private boolean processMockPayment(Double amount) {
        return true;
    }
    
    private PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setBookingId(payment.getBooking().getBookingId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate().toString());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        return dto;
    }
}
