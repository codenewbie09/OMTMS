package com.omtms.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateBookingDTO {
    private Long customerId;
    private Long showId;
    private List<Long> seatIds;
}
