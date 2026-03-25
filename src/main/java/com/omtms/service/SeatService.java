package com.omtms.service;

import com.omtms.dto.SeatDTO;
import com.omtms.entity.Seat;
import com.omtms.entity.Theater;
import com.omtms.repository.SeatRepository;
import com.omtms.repository.TheaterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {
    
    private final SeatRepository seatRepository;
    private final TheaterRepository theaterRepository;
    
    public SeatService(SeatRepository seatRepository, TheaterRepository theaterRepository) {
        this.seatRepository = seatRepository;
        this.theaterRepository = theaterRepository;
    }
    
    public List<SeatDTO> getSeatsByTheater(Long theaterId) {
        if (!theaterRepository.existsById(theaterId)) {
            throw new RuntimeException("Theater not found with id: " + theaterId);
        }
        
        return seatRepository.findByTheaterTheaterId(theaterId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private SeatDTO toDTO(Seat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setSeatId(seat.getSeatId());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setRow(seat.getRow());
        dto.setSeatType(seat.getSeatType());
        dto.setIsAvailable(seat.getIsAvailable());
        return dto;
    }
}
