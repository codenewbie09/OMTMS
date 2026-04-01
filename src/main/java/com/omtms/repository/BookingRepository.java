package com.omtms.repository;

import com.omtms.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;
import java.util.List;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerCustomerId(Long customerId);
    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);
    Optional<Booking> findByTicketCode(String ticketCode);
}
