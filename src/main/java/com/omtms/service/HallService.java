package com.omtms.service;

import com.omtms.dto.HallDTO;
import com.omtms.entity.Hall;
import com.omtms.repository.HallRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallService {
    
    private final HallRepository hallRepository;
    
    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }
    
    public List<HallDTO> getAllHalls() {
        return hallRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public HallDTO getHallById(Long id) {
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found with id: " + id));
        return toDTO(hall);
    }
    
    @Transactional
    public HallDTO createHall(HallDTO hallDTO) {
        Hall hall = new Hall();
        hall.setName(hallDTO.getName());
        hall.setLocation(hallDTO.getLocation());
        hall.setCapacity(hallDTO.getCapacity());
        hall.setBalconyCapacity(hallDTO.getBalconyCapacity());
        hall.setPremiumCapacity(hallDTO.getPremiumCapacity());
        hall.setOrdinaryCapacity(hallDTO.getOrdinaryCapacity());
        hall.setBalconyPrice(hallDTO.getBalconyPrice());
        hall.setPremiumPrice(hallDTO.getPremiumPrice());
        hall.setOrdinaryPrice(hallDTO.getOrdinaryPrice());
        hall.setCreatedAt(LocalDateTime.now().toString());
        hall.setUpdatedAt(LocalDateTime.now().toString());
        
        Hall saved = hallRepository.save(hall);
        return toDTO(saved);
    }
    
    @Transactional
    public HallDTO updateHall(Long id, HallDTO hallDTO) {
        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found with id: " + id));
        
        hall.setName(hallDTO.getName());
        hall.setLocation(hallDTO.getLocation());
        hall.setCapacity(hallDTO.getCapacity());
        hall.setBalconyCapacity(hallDTO.getBalconyCapacity());
        hall.setPremiumCapacity(hallDTO.getPremiumCapacity());
        hall.setOrdinaryCapacity(hallDTO.getOrdinaryCapacity());
        hall.setBalconyPrice(hallDTO.getBalconyPrice());
        hall.setPremiumPrice(hallDTO.getPremiumPrice());
        hall.setOrdinaryPrice(hallDTO.getOrdinaryPrice());
        hall.setUpdatedAt(LocalDateTime.now().toString());
        
        Hall updated = hallRepository.save(hall);
        return toDTO(updated);
    }
    
    @Transactional
    public void deleteHall(Long id) {
        if (!hallRepository.existsById(id)) {
            throw new RuntimeException("Hall not found with id: " + id);
        }
        hallRepository.deleteById(id);
    }
    
    private HallDTO toDTO(Hall hall) {
        HallDTO dto = new HallDTO();
        dto.setHallId(hall.getHallId());
        dto.setName(hall.getName());
        dto.setLocation(hall.getLocation());
        dto.setCapacity(hall.getCapacity());
        dto.setBalconyCapacity(hall.getBalconyCapacity());
        dto.setPremiumCapacity(hall.getPremiumCapacity());
        dto.setOrdinaryCapacity(hall.getOrdinaryCapacity());
        dto.setBalconyPrice(hall.getBalconyPrice());
        dto.setPremiumPrice(hall.getPremiumPrice());
        dto.setOrdinaryPrice(hall.getOrdinaryPrice());
        return dto;
    }
}