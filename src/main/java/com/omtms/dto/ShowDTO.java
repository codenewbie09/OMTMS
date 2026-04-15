package com.omtms.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ShowDTO {
    private Long showId;
    private Long movieId;
    private Long hallId;
    private String movieName;
    private String hallName;
    private LocalTime startTime;
    private LocalTime endTime;
    private Double price;
    private String createdAt;
}