package com.omtms.controller;

import com.omtms.dto.BookingDTO;
import com.omtms.dto.CreateBookingDTO;
import com.omtms.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {
    
    private final BookingService bookingService;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }
    
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody CreateBookingDTO createBookingDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(createBookingDTO));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
    
    @PostMapping("/verify/{ticketCode}")
    public ResponseEntity<BookingDTO> verifyTicket(@PathVariable String ticketCode) {
        return ResponseEntity.ok(bookingService.verifyTicket(ticketCode));
    }
    
    @PostMapping("/cancel/{id}")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id, @RequestBody CancelRequest request) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, request.getReason()));
    }
    
    @PostMapping("/refund/{id}")
    public ResponseEntity<BookingDTO> processRefund(@PathVariable Long id, @RequestBody RefundRequest request) {
        return ResponseEntity.ok(bookingService.processRefund(id, request.getAmount()));
    }
    
    public static class CancelRequest {
        private String reason;
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
    
    public static class RefundRequest {
        private Double amount;
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}
