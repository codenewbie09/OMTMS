package com.omtms.dto;

import lombok.Data;

@Data
public class HallDTO {
    private Long hallId;
    private String name;
    private String location;
    private Integer capacity;
    private Integer balconyCapacity;
    private Integer premiumCapacity;
    private Integer ordinaryCapacity;
    private Double balconyPrice;
    private Double premiumPrice;
    private Double ordinaryPrice;
}