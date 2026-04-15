package com.omtms.controller;

import com.omtms.dto.CreateShowDTO;
import com.omtms.dto.ShowDTO;
import com.omtms.dto.SeatDTO;
import com.omtms.service.SeatService;
import com.omtms.service.ShowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {
    
    private final ShowService showService;
    private final SeatService seatService;
    
    public ShowController(ShowService showService, SeatService seatService) {
        this.showService = showService;
        this.seatService = seatService;
    }
    
    @GetMapping
    public ResponseEntity<List<ShowDTO>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ShowDTO> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }
    
    @GetMapping("/{showId}/seats")
    public ResponseEntity<List<SeatDTO>> getShowSeats(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getShowSeats(showId));
    }
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowDTO>> getShowsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }
    
    @GetMapping("/hall/{hallId}")
    public ResponseEntity<List<ShowDTO>> getShowsByHall(@PathVariable Long hallId) {
        return ResponseEntity.ok(showService.getShowsByHall(hallId));
    }
    
    @PostMapping
    public ResponseEntity<ShowDTO> createShow(@RequestBody CreateShowDTO createShowDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(showService.createShow(createShowDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ShowDTO> updateShow(@PathVariable Long id, @RequestBody CreateShowDTO createShowDTO) {
        return ResponseEntity.ok(showService.updateShow(id, createShowDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }
}
