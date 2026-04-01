package com.omtms.service;

import com.omtms.dto.CreateShowDTO;
import com.omtms.dto.ShowDTO;
import com.omtms.entity.Movie;
import com.omtms.entity.Show;
import com.omtms.entity.Theater;
import com.omtms.repository.MovieRepository;
import com.omtms.repository.ShowRepository;
import com.omtms.repository.TheaterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {
    
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final SeatService seatService;
    
    public ShowService(ShowRepository showRepository, MovieRepository movieRepository, 
                      TheaterRepository theaterRepository, SeatService seatService) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
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
    
    public List<ShowDTO> getShowsByTheater(Long theaterId) {
        return showRepository.findByTheaterTheaterId(theaterId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ShowDTO createShow(CreateShowDTO createShowDTO) {
        Movie movie = movieRepository.findById(createShowDTO.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        Theater theater = theaterRepository.findById(createShowDTO.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        
        Show show = new Show();
        show.setMovie(movie);
        show.setTheater(theater);
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
                throw new RuntimeException("Invalid start time format. Use HH:mm");
            }
        }
        
        if (createShowDTO.getEndTime() != null && movie.getDuration() != null) {
            show.setEndTime(LocalTime.parse(createShowDTO.getEndTime()));
        } else if (movie.getDuration() != null && show.getStartTime() != null) {
            show.setEndTime(show.getStartTime().plusMinutes(movie.getDuration()));
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
        
        if (createShowDTO.getTheaterId() != null) {
            Theater theater = theaterRepository.findById(createShowDTO.getTheaterId())
                    .orElseThrow(() -> new RuntimeException("Theater not found"));
            show.setTheater(theater);
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
        dto.setTheaterId(show.getTheater().getTheaterId());
        dto.setMovieName(show.getMovie().getTitle());
        dto.setTheaterName(show.getTheater().getName());
        dto.setStartTime(show.getStartTime());
        dto.setEndTime(show.getEndTime());
        dto.setPrice(show.getPrice());
        dto.setCreatedAt(show.getCreatedAt());
        return dto;
    }
}
