package com.omtms.service;

import com.omtms.dto.BookingDTO;
import com.omtms.dto.CreateBookingDTO;
import com.omtms.dto.SeatDTO;
import com.omtms.entity.Booking;
import com.omtms.entity.BookingSeat;
import com.omtms.entity.Customer;
import com.omtms.entity.Show;
import com.omtms.entity.ShowSeat;
import com.omtms.repository.BookingRepository;
import com.omtms.repository.BookingSeatRepository;
import com.omtms.repository.CustomerRepository;
import com.omtms.repository.ShowRepository;
import com.omtms.repository.ShowSeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final CustomerRepository customerRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SeatService seatService;
    private final QRCodeService qrCodeService;
    
    public BookingService(BookingRepository bookingRepository, BookingSeatRepository bookingSeatRepository,
                         CustomerRepository customerRepository, ShowRepository showRepository,
                         ShowSeatRepository showSeatRepository, SeatService seatService,
                         QRCodeService qrCodeService) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.customerRepository = customerRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.seatService = seatService;
        this.qrCodeService = qrCodeService;
    }
    
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return toDTO(booking);
    }
    
    public BookingDTO getBookingByTicketCode(String ticketCode) {
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with ticket code: " + ticketCode));
        return toDTO(booking);
    }
    
    public List<BookingDTO> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerCustomerId(customerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BookingDTO createBooking(CreateBookingDTO createBookingDTO) {
        Customer customer = customerRepository.findById(createBookingDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Show show = showRepository.findById(createBookingDTO.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        seatService.bookSeats(createBookingDTO.getShowId(), createBookingDTO.getSeatIds());
        
        List<ShowSeat> seats = new ArrayList<>();
        double totalAmount = 0;
        for (Long seatId : createBookingDTO.getSeatIds()) {
            ShowSeat seat = showSeatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));
            seats.add(seat);
            totalAmount += seat.getPrice();
        }
        
        double discount = 0;
        double bulkDiscount = 0;
        double loyaltyDiscount = 0;
        
        if (seats.size() >= 5) {
            bulkDiscount = totalAmount * 0.10;
        }
        
        loyaltyDiscount = calculateLoyaltyDiscount(customer, totalAmount);
        
        discount = bulkDiscount + loyaltyDiscount;
        
        totalAmount = totalAmount - discount;
        
        int purchaseCount = customer.getPurchaseCount() != null ? customer.getPurchaseCount() : 0;
        double totalSpent = customer.getTotalSpent() != null ? customer.getTotalSpent() : 0.0;
        int loyaltyPoints = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
        
        customer.setPurchaseCount(purchaseCount + 1);
        customer.setTotalSpent(totalSpent + totalAmount);
        customer.setLoyaltyPoints(loyaltyPoints + (int)(totalAmount / 1));
        
        if ((purchaseCount + 1) >= 3 && (customer.getIsLoyaltyMember() == null || !customer.getIsLoyaltyMember())) {
            customer.setIsLoyaltyMember(true);
            if (customer.getLoyaltyId() == null || customer.getLoyaltyId().isEmpty()) {
                customer.setLoyaltyId("LOYAL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
        }
        customerRepository.save(customer);
        
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setShow(show);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setDiscountAmount(discount);
        booking.setStatus("CONFIRMED");
        booking.setTicketCode(generateTicketCode());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        for (ShowSeat seat : seats) {
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setShowSeat(seat);
            bookingSeatRepository.save(bookingSeat);
        }
        
        String seatsStr = seats.stream().map(s -> s.getRow() + s.getSeatNumber()).collect(Collectors.joining(","));
        String qrCode = qrCodeService.generateTicketQRCode(
            savedBooking.getTicketCode(),
            show.getMovie().getTitle(),
            show.getTheater().getName(),
            show.getStartTime() != null ? show.getStartTime().toString() : "",
            seatsStr
        );
        savedBooking.setQrCode(qrCode);
        savedBooking = bookingRepository.save(savedBooking);
        
        return toDTO(savedBooking);
    }
    
    @Transactional
    public BookingDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }
    
    @Transactional
    public BookingDTO cancelBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }
        
        double hoursUntilShow = 0;
        if (booking.getShow().getStartTime() != null) {
            LocalDateTime showDateTime = LocalDateTime.of(LocalDateTime.now().toLocalDate(), booking.getShow().getStartTime());
            hoursUntilShow = java.time.Duration.between(LocalDateTime.now(), showDateTime).toHours();
        }
        
        double refundPercent;
        if (hoursUntilShow > 24) {
            refundPercent = 0.80;
        } else if (hoursUntilShow > 4) {
            refundPercent = 0.50;
        } else {
            refundPercent = 0.0;
        }
        
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(id);
        for (BookingSeat bs : bookingSeats) {
            ShowSeat seat = bs.getShowSeat();
            seat.setIsBooked(false);
            showSeatRepository.save(seat);
        }
        
        booking.setStatus("CANCELLED");
        booking.setCancellationReason(reason + " (Refund: " + (refundPercent * 100) + "%)");
        booking.setRefundAmount(booking.getTotalAmount() * refundPercent);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }
    
    @Transactional
    public BookingDTO processRefund(Long id, Double amount) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Only cancelled bookings can be refunded");
        }
        
        booking.setRefundAmount(amount);
        booking.setStatus("REFUNDED");
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }
    
    @Transactional
    public BookingDTO verifyTicket(String ticketCode) {
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with ticket code: " + ticketCode));
        
        if ("USED".equals(booking.getStatus())) {
            throw new RuntimeException("Ticket already used");
        }
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Ticket has been cancelled");
        }
        
        booking.setStatus("USED");
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }
    
    public List<BookingDTO> getDailyBookings(LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
        return bookingRepository.findByBookingDateBetween(startOfDay, endOfDay).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getMonthlyBookings(int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        return bookingRepository.findByBookingDateBetween(startOfMonth, endOfMonth).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private String generateTicketCode() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private double calculateLoyaltyDiscount(Customer customer, double totalAmount) {
        if (customer.getIsLoyaltyMember() == null || !customer.getIsLoyaltyMember()) {
            return 0;
        }
        
        int points = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
        
        if (points >= 500) {
            return totalAmount * 0.15;
        } else if (points >= 200) {
            return totalAmount * 0.10;
        } else if (points >= 100) {
            return totalAmount * 0.05;
        }
        
        return 0;
    }
    
    private BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setCustomerId(booking.getCustomer().getCustomerId());
        dto.setCustomerName(booking.getCustomer().getUser().getName());
        dto.setShowId(booking.getShow().getShowId());
        dto.setMovieName(booking.getShow().getMovie().getTitle());
        dto.setTheaterName(booking.getShow().getTheater().getName());
        dto.setShowTime(booking.getShow().getStartTime() != null ? 
            LocalDateTime.of(LocalDateTime.now().toLocalDate(), booking.getShow().getStartTime()) : null);
        dto.setBookingDate(booking.getBookingDate());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setTicketCode(booking.getTicketCode());
        dto.setRefundAmount(booking.getRefundAmount());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setQrCode(booking.getQrCode());
        dto.setDiscountAmount(booking.getDiscountAmount());
        
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(booking.getBookingId());
        List<SeatDTO> seats = new ArrayList<>();
        for (BookingSeat bs : bookingSeats) {
            SeatDTO seatDTO = new SeatDTO();
            seatDTO.setSeatId(bs.getShowSeat().getShowSeatId());
            seatDTO.setSeatNumber(bs.getShowSeat().getSeatNumber());
            seatDTO.setRow(bs.getShowSeat().getRow());
            seatDTO.setSeatType(bs.getShowSeat().getSeatType());
            seats.add(seatDTO);
        }
        dto.setSeats(seats);
        
        return dto;
    }
}
