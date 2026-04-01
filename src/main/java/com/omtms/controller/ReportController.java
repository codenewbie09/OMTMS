package com.omtms.controller;

import com.omtms.dto.ReportDTO;
import com.omtms.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    private final ReportService reportService;
    
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    
    @GetMapping("/movies")
    public ResponseEntity<ReportDTO> getMovieReport() {
        return ResponseEntity.ok(reportService.getMovieReport());
    }
    
    @GetMapping("/theaters")
    public ResponseEntity<ReportDTO> getTheaterReport() {
        return ResponseEntity.ok(reportService.getTheaterReport());
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<ReportDTO> getBookingReport() {
        return ResponseEntity.ok(reportService.getBookingReport());
    }
    
    @GetMapping("/shows")
    public ResponseEntity<ReportDTO> getShowReport() {
        return ResponseEntity.ok(reportService.getShowReport());
    }
    
    @GetMapping("/summary")
    public ResponseEntity<ReportDTO> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }
}
