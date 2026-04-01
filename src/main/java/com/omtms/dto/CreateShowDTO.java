package com.omtms.dto;

import lombok.Data;

@Data
public class CreateShowDTO {
    private Long movieId;
    private Long theaterId;
    private String startTime;
    private String endTime;
    private Double price;
}
