package com.omtms.service;

import com.omtms.dto.TheaterDTO;
import com.omtms.entity.Theater;
import com.omtms.repository.TheaterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheaterService {
    
    private final TheaterRepository theaterRepository;
    
    public TheaterService(TheaterRepository theaterRepository) {
        this.theaterRepository = theaterRepository;
    }
    
    public List<TheaterDTO> getAllTheaters() {
        return theaterRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public TheaterDTO getTheaterById(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found with id: " + id));
        return toDTO(theater);
    }
    
    @Transactional
    public TheaterDTO createTheater(TheaterDTO theaterDTO) {
        Theater theater = new Theater();
        theater.setName(theaterDTO.getName());
        theater.setLocation(theaterDTO.getLocation());
        theater.setCapacity(theaterDTO.getCapacity());
        theater.setCreatedAt(LocalDateTime.now().toString());
        theater.setUpdatedAt(LocalDateTime.now().toString());
        
        Theater saved = theaterRepository.save(theater);
        return toDTO(saved);
    }
    
    @Transactional
    public TheaterDTO updateTheater(Long id, TheaterDTO theaterDTO) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found with id: " + id));
        
        theater.setName(theaterDTO.getName());
        theater.setLocation(theaterDTO.getLocation());
        theater.setCapacity(theaterDTO.getCapacity());
        theater.setUpdatedAt(LocalDateTime.now().toString());
        
        Theater updated = theaterRepository.save(theater);
        return toDTO(updated);
    }
    
    @Transactional
    public void deleteTheater(Long id) {
        if (!theaterRepository.existsById(id)) {
            throw new RuntimeException("Theater not found with id: " + id);
        }
        theaterRepository.deleteById(id);
    }
    
    private TheaterDTO toDTO(Theater theater) {
        TheaterDTO dto = new TheaterDTO();
        dto.setTheaterId(theater.getTheaterId());
        dto.setName(theater.getName());
        dto.setLocation(theater.getLocation());
        dto.setCapacity(theater.getCapacity());
        dto.setBalconyCapacity(theater.getBalconyCapacity());
        dto.setPremiumCapacity(theater.getPremiumCapacity());
        dto.setOrdinaryCapacity(theater.getOrdinaryCapacity());
        dto.setBalconyPrice(theater.getBalconyPrice());
        dto.setPremiumPrice(theater.getPremiumPrice());
        dto.setOrdinaryPrice(theater.getOrdinaryPrice());
        return dto;
    }
}
