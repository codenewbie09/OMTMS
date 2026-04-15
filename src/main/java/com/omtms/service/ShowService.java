package com.omtms.service;

import com.omtms.dto.CreateShowDTO;
import com.omtms.dto.ShowDTO;
import com.omtms.entity.Movie;
import com.omtms.entity.Show;
import com.omtms.entity.Hall;
import com.omtms.repository.MovieRepository;
import com.omtms.repository.ShowRepository;
import com.omtms.repository.HallRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {
    
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final SeatService seatService;
    
    public ShowService(ShowRepository showRepository, MovieRepository movieRepository, 
                      HallRepository hallRepository, SeatService seatService) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
        this.seatService = seatService;
    }
    
    public List<ShowDTO> getAllShows() {
        return showRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public ShowDTO getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + id));
        return toDTO(show);
    }
    
    public List<ShowDTO> getShowsByMovie(Long movieId) {
        return showRepository.findByMovieMovieId(movieId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<ShowDTO> getShowsByHall(Long hallId) {
        return showRepository.findByHallHallId(hallId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ShowDTO createShow(CreateShowDTO createShowDTO) {
        Movie movie = movieRepository.findById(createShowDTO.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        Hall hall = hallRepository.findById(createShowDTO.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));
        
        Show show = new Show();
        show.setMovie(movie);
        show.setHall(hall);
        show.setPrice(createShowDTO.getPrice());
        show.setCreatedAt(java.time.LocalDateTime.now().toString());
        
        if (createShowDTO.getStartTime() != null) {
            try {
                String timeStr = createShowDTO.getStartTime();
                if (timeStr.contains("T")) {
                    timeStr = timeStr.split("T")[1].substring(0, 5);
                }
                show.setStartTime(LocalTime.parse(timeStr));
            } catch (Exception e) {
                show.setStartTime(LocalTime.parse(createShowDTO.getStartTime()));
            }
        }
        
        if (show.getStartTime() != null && movie.getDuration() != null) {
            int duration = movie.getDuration();
            show.setEndTime(show.getStartTime().plusMinutes(duration));
        }
        
        Show saved = showRepository.save(show);
        seatService.initializeShowSeats(saved);
        
        return toDTO(saved);
    }
    
    @Transactional
    public ShowDTO updateShow(Long id, CreateShowDTO createShowDTO) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        if (createShowDTO.getMovieId() != null) {
            Movie movie = movieRepository.findById(createShowDTO.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            show.setMovie(movie);
        }
        
        if (createShowDTO.getHallId() != null) {
            Hall hall = hallRepository.findById(createShowDTO.getHallId())
                    .orElseThrow(() -> new RuntimeException("Hall not found"));
            show.setHall(hall);
        }
        
        if (createShowDTO.getPrice() != null) {
            show.setPrice(createShowDTO.getPrice());
        }
        
        if (createShowDTO.getStartTime() != null) {
            show.setStartTime(LocalTime.parse(createShowDTO.getStartTime()));
        }
        
        Show updated = showRepository.save(show);
        return toDTO(updated);
    }
    
    @Transactional
    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)) {
            throw new RuntimeException("Show not found with id: " + id);
        }
        showRepository.deleteById(id);
    }
    
    private ShowDTO toDTO(Show show) {
        ShowDTO dto = new ShowDTO();
        dto.setShowId(show.getShowId());
        dto.setMovieId(show.getMovie().getMovieId());
        dto.setMovieName(show.getMovie().getTitle());
        if (show.getHall() != null) {
            dto.setHallId(show.getHall().getHallId());
            dto.setHallName(show.getHall().getName());
        }
        dto.setStartTime(show.getStartTime());
        dto.setEndTime(show.getEndTime());
        dto.setPrice(show.getPrice());
        dto.setCreatedAt(show.getCreatedAt());
        return dto;
    }
}