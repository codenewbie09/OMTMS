package com.omtms.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingDTO {
    private Long bookingId;
    private Long customerId;
    private String customerName;
    private Long showId;
    private String movieName;
    private String theaterName;
    private LocalDateTime showTime;
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String status;
    private String ticketCode;
    private String cancellationReason;
    private Double refundAmount;
    private String qrCode;
    private Double discountAmount;
    private List<SeatDTO> seats;
}
