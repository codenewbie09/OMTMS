package com.omtms.controller;

import com.omtms.dto.HallDTO;
import com.omtms.service.HallService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
public class HallController {
    
    private final HallService hallService;
    
    public HallController(HallService hallService) {
        this.hallService = hallService;
    }
    
    @GetMapping
    public ResponseEntity<List<HallDTO>> getAllHalls() {
        return ResponseEntity.ok(hallService.getAllHalls());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HallDTO> getHallById(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.getHallById(id));
    }
    
    @PostMapping
    public ResponseEntity<HallDTO> createHall(@RequestBody HallDTO hallDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hallService.createHall(hallDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HallDTO> updateHall(@PathVariable Long id, @RequestBody HallDTO hallDTO) {
        return ResponseEntity.ok(hallService.updateHall(id, hallDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        hallService.deleteHall(id);
        return ResponseEntity.noContent().build();
    }
}