package com.omtms.service;

import com.omtms.dto.SeatDTO;
import com.omtms.entity.Show;
import com.omtms.entity.ShowSeat;
import com.omtms.entity.Hall;
import com.omtms.repository.ShowSeatRepository;
import com.omtms.repository.HallRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {
    
    private final HallRepository hallRepository;
    private final ShowSeatRepository showSeatRepository;
    
    public SeatService(HallRepository hallRepository,
                      ShowSeatRepository showSeatRepository) {
        this.hallRepository = hallRepository;
        this.showSeatRepository = showSeatRepository;
    }
    
    public List<SeatDTO> getSeatsByTheater(Long hallId) {
        if (!hallRepository.existsById(hallId)) {
            throw new RuntimeException("Hall not found with id: " + hallId);
        }
        
        return showSeatRepository.findByShowShowId(hallId).stream()
                .map(this::toShowSeatDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void initializeShowSeats(Show show) {
        Hall hall = show.getHall();
        Integer balconyCap = hall.getBalconyCapacity() != null ? hall.getBalconyCapacity() : 30;
        Integer premiumCap = hall.getPremiumCapacity() != null ? hall.getPremiumCapacity() : 40;
        Integer ordinaryCap = hall.getOrdinaryCapacity() != null ? hall.getOrdinaryCapacity() : 30;
        Double balconyPrice = hall.getBalconyPrice() != null ? hall.getBalconyPrice() : 350.0;
        Double premiumPrice = hall.getPremiumPrice() != null ? hall.getPremiumPrice() : 250.0;
        Double ordinaryPrice = hall.getOrdinaryPrice() != null ? hall.getOrdinaryPrice() : 150.0;
        
        List<ShowSeat> showSeats = new ArrayList<>();
        
        int row = 0;
        for (int i = 0; i < balconyCap; i++) {
            char rowChar = (char) ('A' + row);
            ShowSeat seat = new ShowSeat();
            seat.setShow(show);
            seat.setRow(String.valueOf(rowChar));
            seat.setSeatNumber(String.valueOf(i + 1));
            seat.setSeatType("Balcony");
            seat.setCategory("BALCONY");
            seat.setIsBooked(false);
            seat.setIsBlocked(false);
            seat.setPrice(balconyPrice);
            showSeats.add(seat);
            if ((i + 1) % 10 == 0) row++;
        }
        
        row++;
        for (int i = 0; i < premiumCap; i++) {
            char rowChar = (char) ('A' + row);
            ShowSeat seat = new ShowSeat();
            seat.setShow(show);
            seat.setRow(String.valueOf(rowChar));
            seat.setSeatNumber(String.valueOf(i + 1));
            seat.setSeatType("Premium");
            seat.setCategory("PREMIUM");
            seat.setIsBooked(false);
            seat.setIsBlocked(false);
            seat.setPrice(premiumPrice);
            showSeats.add(seat);
            if ((i + 1) % 10 == 0) row++;
        }
        
        row++;
        for (int i = 0; i < ordinaryCap; i++) {
            char rowChar = (char) ('A' + row);
            ShowSeat seat = new ShowSeat();
            seat.setShow(show);
            seat.setRow(String.valueOf(rowChar));
            seat.setSeatNumber(String.valueOf(i + 1));
            seat.setSeatType("Ordinary");
            seat.setCategory("ORDINARY");
            seat.setIsBooked(false);
            seat.setIsBlocked(false);
            seat.setPrice(ordinaryPrice);
            showSeats.add(seat);
            if ((i + 1) % 10 == 0) row++;
        }
        
        showSeatRepository.saveAll(showSeats);
    }
    
    public List<SeatDTO> getShowSeats(Long showId) {
        return showSeatRepository.findByShowShowId(showId).stream()
                .map(this::toShowSeatDTO)
                .collect(Collectors.toList());
    }
    
    public List<SeatDTO> getAvailableShowSeats(Long showId) {
        return showSeatRepository.findByShowShowIdAndIsBooked(showId, false).stream()
                .map(this::toShowSeatDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void bookSeats(Long showId, List<Long> seatIds) {
        for (Long seatId : seatIds) {
            ShowSeat seat = showSeatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));
            if (!seat.getShow().getShowId().equals(showId)) {
                throw new RuntimeException("Seat does not belong to this show");
            }
            if (seat.getIsBooked() != null && seat.getIsBooked()) {
                throw new RuntimeException("Seat already booked: " + seat.getSeatNumber());
            }
            seat.setIsBooked(true);
            showSeatRepository.save(seat);
        }
    }
    
    @Transactional
    public void blockSeat(Long seatId, String reason) {
        ShowSeat seat = showSeatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setIsBlocked(true);
        seat.setBlockReason(reason);
        showSeatRepository.save(seat);
    }
    
    @Transactional
    public void unblockSeat(Long seatId) {
        ShowSeat seat = showSeatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setIsBlocked(false);
        seat.setBlockReason(null);
        showSeatRepository.save(seat);
    }
    
    private SeatDTO toShowSeatDTO(ShowSeat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setSeatId(seat.getShowSeatId());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setRow(seat.getRow());
        dto.setSeatType(seat.getSeatType());
        dto.setPrice(seat.getPrice());
        boolean isBooked = seat.getIsBooked() != null && seat.getIsBooked();
        boolean isBlocked = seat.getIsBlocked() != null && seat.getIsBlocked();
        dto.setIsAvailable(!isBooked && !isBlocked);
        dto.setIsBlocked(isBlocked);
        dto.setBlockReason(seat.getBlockReason());
        dto.setCategory(seat.getCategory());
        return dto;
    }
}
