package com.omtms.controller;

import com.omtms.dto.SeatDTO;
import com.omtms.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
public class SeatController {
    
    private final SeatService seatService;
    
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }
    
    @GetMapping("/{theaterId}/seats")
    public ResponseEntity<List<SeatDTO>> getSeatsByTheater(@PathVariable Long theaterId) {
        return ResponseEntity.ok(seatService.getSeatsByTheater(theaterId));
    }
}
