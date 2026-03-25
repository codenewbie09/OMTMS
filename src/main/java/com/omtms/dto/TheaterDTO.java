package com.omtms.dto;

import lombok.Data;

@Data
public class TheaterDTO {
    private Long theaterId;
    private String name;
    private String location;
    private Integer capacity;
}
