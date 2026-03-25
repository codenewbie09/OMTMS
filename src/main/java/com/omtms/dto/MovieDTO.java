package com.omtms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MovieDTO {
    private Long movieId;
    private String title;
    private String genre;
    private Integer duration;
    private LocalDate releaseDate;
    private Double rating;
}
