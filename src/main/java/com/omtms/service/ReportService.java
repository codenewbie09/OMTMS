package com.omtms.service;

import com.omtms.dto.ReportDTO;
import com.omtms.entity.Booking;
import com.omtms.entity.Movie;
import com.omtms.entity.Show;
import com.omtms.entity.Hall;
import com.omtms.repository.BookingRepository;
import com.omtms.repository.MovieRepository;
import com.omtms.repository.ShowRepository;
import com.omtms.repository.HallRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    
    public ReportService(MovieRepository movieRepository, HallRepository hallRepository,
                        ShowRepository showRepository, BookingRepository bookingRepository) {
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }
    
    public ReportDTO getMovieReport() {
        List<Movie> movies = movieRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalMovies", movies.size());
        data.put("movies", movies.stream().map(m -> Map.of(
            "id", m.getMovieId(),
            "title", m.getTitle(),
            "genre", m.getGenre(),
            "duration", m.getDuration(),
            "rating", m.getRating()
        )).collect(Collectors.toList()));
        return new ReportDTO("Movie Report", data);
    }
    
    public ReportDTO getHallReport() {
        List<Hall> halls = hallRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalHalls", halls.size());
        data.put("halls", halls.stream().map(h -> Map.of(
            "id", h.getHallId(),
            "name", h.getName(),
            "location", h.getLocation(),
            "capacity", h.getCapacity()
        )).collect(Collectors.toList()));
        return new ReportDTO("Hall Report", data);
    }
    
    public ReportDTO getBookingReport() {
        List<Booking> bookings = bookingRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalBookings", bookings.size());
        data.put("bookings", bookings.stream().map(b -> Map.of(
            "id", b.getBookingId(),
            "customer", b.getCustomer() != null ? b.getCustomer().getUser().getName() : "N/A",
            "movie", b.getShow() != null && b.getShow().getMovie() != null ? b.getShow().getMovie().getTitle() : "N/A",
            "status", b.getStatus(),
            "totalAmount", b.getTotalAmount()
        )).collect(Collectors.toList()));
        return new ReportDTO("Booking Report", data);
    }
    
    public ReportDTO getShowReport() {
        List<Show> shows = showRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalShows", shows.size());
        data.put("shows", shows.stream().map(s -> Map.of(
            "id", s.getShowId(),
            "movieName", s.getMovie() != null ? s.getMovie().getTitle() : "N/A",
            "hallName", s.getHall() != null ? s.getHall().getName() : "N/A",
            "startTime", s.getStartTime(),
            "endTime", s.getEndTime(),
            "price", s.getPrice()
        )).collect(Collectors.toList()));
        return new ReportDTO("Show Report", data);
    }
    
    public ReportDTO getSummaryReport() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalMovies", movieRepository.count());
        data.put("totalHalls", hallRepository.count());
        data.put("totalShows", showRepository.count());
        data.put("totalBookings", bookingRepository.count());
        return new ReportDTO("Summary Report", data);
    }
}