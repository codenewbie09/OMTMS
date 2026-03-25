package com.omtms.dto;

import lombok.Data;

@Data
public class SeatDTO {
    private Long seatId;
    private String seatNumber;
    private String row;
    private String seatType;
    private Boolean isAvailable;
}
