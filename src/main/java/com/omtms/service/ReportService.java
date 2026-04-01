package com.omtms.service;

import com.omtms.dto.ReportDTO;
import com.omtms.entity.Booking;
import com.omtms.entity.Movie;
import com.omtms.entity.Show;
import com.omtms.entity.Theater;
import com.omtms.repository.BookingRepository;
import com.omtms.repository.MovieRepository;
import com.omtms.repository.ShowRepository;
import com.omtms.repository.TheaterRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    
    public ReportService(MovieRepository movieRepository, TheaterRepository theaterRepository,
                        ShowRepository showRepository, BookingRepository bookingRepository) {
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
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
    
    public ReportDTO getTheaterReport() {
        List<Theater> theaters = theaterRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalTheaters", theaters.size());
        data.put("theaters", theaters.stream().map(t -> Map.of(
            "id", t.getTheaterId(),
            "name", t.getName(),
            "location", t.getLocation(),
            "capacity", t.getCapacity()
        )).collect(Collectors.toList()));
        return new ReportDTO("Theater Report", data);
    }
    
    public ReportDTO getBookingReport() {
        List<Booking> bookings = bookingRepository.findAll();
        double totalRevenue = bookings.stream()
            .filter(b -> "CONFIRMED".equals(b.getStatus()))
            .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0)
            .sum();
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalBookings", bookings.size());
        data.put("confirmedBookings", bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count());
        data.put("cancelledBookings", bookings.stream().filter(b -> "CANCELLED".equals(b.getStatus())).count());
        data.put("totalRevenue", totalRevenue);
        data.put("bookings", bookings.stream().map(b -> Map.of(
            "id", b.getBookingId(),
            "customerId", b.getCustomer() != null ? b.getCustomer().getCustomerId() : 0,
            "showId", b.getShow() != null ? b.getShow().getShowId() : 0,
            "status", b.getStatus(),
            "totalAmount", b.getTotalAmount() != null ? b.getTotalAmount() : 0,
            "bookingDate", b.getBookingDate()
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
            "theaterName", s.getTheater() != null ? s.getTheater().getName() : "N/A",
            "startTime", s.getStartTime(),
            "endTime", s.getEndTime(),
            "price", s.getPrice()
        )).collect(Collectors.toList()));
        return new ReportDTO("Show Report", data);
    }
    
    public ReportDTO getSummaryReport() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalMovies", movieRepository.count());
        data.put("totalTheaters", theaterRepository.count());
        data.put("totalShows", showRepository.count());
        data.put("totalBookings", bookingRepository.count());
        
        List<Booking> bookings = bookingRepository.findAll();
        double totalRevenue = bookings.stream()
            .filter(b -> "CONFIRMED".equals(b.getStatus()))
            .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0)
            .sum();
        data.put("totalRevenue", totalRevenue);
        data.put("confirmedBookings", bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count());
        
        return new ReportDTO("Summary Report", data);
    }
}
