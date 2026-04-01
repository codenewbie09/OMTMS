package com.omtms.dto;

import lombok.Data;

@Data
public class SeatDTO {
    private Long seatId;
    private Long showSeatId;
    private String seatNumber;
    private String row;
    private String seatType;
    private String category;
    private Boolean isAvailable;
    private Boolean isBlocked;
    private String blockReason;
    private Double price;
}
