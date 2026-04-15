package com.omtms.config;

import com.omtms.entity.*;
import com.omtms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final ShowSeatRepository seatRepository;
    private final CustomerRepository customerRepository;
    
    public DataInitializer(UserRepository userRepository, MovieRepository movieRepository,
                          HallRepository hallRepository, ShowRepository showRepository,
                          BookingRepository bookingRepository, ShowSeatRepository seatRepository,
                          CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.customerRepository = customerRepository;
    }
    
    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;
        
        // Create Admin User
        User adminUser = new User();
        adminUser.setEmail("admin@omtms.com");
        adminUser.setPassword("$2a$10$eXrtOZvKdypIWdpUq.sW.uk8UNJHRw4XhhtMgOGx47.UTX5RJf3tG");
        adminUser.setName("Admin");
        adminUser.setRole("ADMIN");
        adminUser.setCreatedAt(LocalDateTime.now().toString());
        adminUser = userRepository.save(adminUser);
        
        Admin admin = new Admin();
        admin.setUser(adminUser);
        admin.setCreatedAt(LocalDateTime.now().toString());
        
        // Create Show Manager User
        User smUser = new User();
        smUser.setEmail("showmanager@omtms.com");
        smUser.setPassword("$2a$10$eXrtOZvKdypIWdpUq.sW.uk8UNJHRw4XhhtMgOGx47.UTX5RJf3tG");
        smUser.setName("Show Manager");
        smUser.setRole("SHOWMANAGER");
        smUser.setCreatedAt(LocalDateTime.now().toString());
        smUser = userRepository.save(smUser);
        
        // Create Counter Staff User
        User csUser = new User();
        csUser.setEmail("counter@omtms.com");
        csUser.setPassword("$2a$10$eXrtOZvKdypIWdpUq.sW.uk8UNJHRw4XhhtMgOGx47.UTX5RJf3tG");
        csUser.setName("Counter Staff");
        csUser.setRole("COUNTER_STAFF");
        csUser.setCreatedAt(LocalDateTime.now().toString());
        csUser = userRepository.save(csUser);
        
        // Create Gate Staff User
        User gsUser = new User();
        gsUser.setEmail("gate@omtms.com");
        gsUser.setPassword("$2a$10$eXrtOZvKdypIWdpUq.sW.uk8UNJHRw4XhhtMgOGx47.UTX5RJf3tG");
        gsUser.setName("Gate Staff");
        gsUser.setRole("GATESTAFF");
        gsUser.setCreatedAt(LocalDateTime.now().toString());
        gsUser = userRepository.save(gsUser);
        
        // Create Customer User
        User customerUser = new User();
        customerUser.setEmail("customer@omtms.com");
        customerUser.setPassword("$2a$10$eXrtOZvKdypIWdpUq.sW.uk8UNJHRw4XhhtMgOGx47.UTX5RJf3tG");
        customerUser.setName("Test Customer");
        customerUser.setRole("CUSTOMER");
        customerUser.setCreatedAt(LocalDateTime.now().toString());
        customerUser = userRepository.save(customerUser);
        
        Customer customer = new Customer();
        customer.setUser(customerUser);
        customer.setCreatedAt(LocalDateTime.now().toString());
        customer = customerRepository.save(customer);
        
        // Create Halls
        Hall hall1 = new Hall();
        hall1.setName("Grand Hall");
        hall1.setLocation("Main Building, Screen 1");
        hall1.setCapacity(120);
        hall1.setBalconyCapacity(30);
        hall1.setPremiumCapacity(40);
        hall1.setOrdinaryCapacity(50);
        hall1.setBalconyPrice(350.0);
        hall1.setPremiumPrice(250.0);
        hall1.setOrdinaryPrice(150.0);
        hall1.setCreatedAt(LocalDateTime.now().toString());
        hall1 = hallRepository.save(hall1);
        
        Hall hall2 = new Hall();
        hall2.setName("IMAX Hall");
        hall2.setLocation("Main Building, Screen 2");
        hall2.setCapacity(200);
        hall2.setBalconyCapacity(50);
        hall2.setPremiumCapacity(70);
        hall2.setOrdinaryCapacity(80);
        hall2.setBalconyPrice(500.0);
        hall2.setPremiumPrice(350.0);
        hall2.setOrdinaryPrice(200.0);
        hall2.setCreatedAt(LocalDateTime.now().toString());
        hall2 = hallRepository.save(hall2);
        
        // Create Movies
        Movie movie1 = new Movie();
        movie1.setTitle("Dune Part Two");
        movie1.setGenre("Sci-Fi");
        movie1.setDuration(166);
        movie1.setRating(8.8);
        movie1.setReleaseDate(java.time.LocalDate.now());
        movie1.setCreatedAt(LocalDateTime.now().toString());
        movie1 = movieRepository.save(movie1);
        
        Movie movie2 = new Movie();
        movie2.setTitle("Avatar 3");
        movie2.setGenre("Action");
        movie2.setDuration(162);
        movie2.setRating(7.9);
        movie2.setReleaseDate(java.time.LocalDate.now());
        movie2.setCreatedAt(LocalDateTime.now().toString());
        movie2 = movieRepository.save(movie2);
        
        Movie movie3 = new Movie();
        movie3.setTitle("The Marvels");
        movie3.setGenre("Adventure");
        movie3.setDuration(135);
        movie3.setRating(6.5);
        movie3.setReleaseDate(java.time.LocalDate.now());
        movie3.setCreatedAt(LocalDateTime.now().toString());
        movie3 = movieRepository.save(movie3);
        
        // Create Shows
        Show show1 = new Show();
        show1.setMovie(movie1);
        show1.setHall(hall1);
        show1.setPrice(250.0);
        show1.setStartTime(java.time.LocalTime.of(14, 0));
        show1.setEndTime(java.time.LocalTime.of(16, 46));
        show1.setCreatedAt(LocalDateTime.now().toString());
        show1 = showRepository.save(show1);
        
        Show show2 = new Show();
        show2.setMovie(movie2);
        show2.setHall(hall1);
        show2.setPrice(300.0);
        show2.setStartTime(java.time.LocalTime.of(18, 0));
        show2.setEndTime(java.time.LocalTime.of(20, 42));
        show2.setCreatedAt(LocalDateTime.now().toString());
        show2 = showRepository.save(show2);
        
        Show show3 = new Show();
        show3.setMovie(movie3);
        show3.setHall(hall2);
        show3.setPrice(350.0);
        show3.setStartTime(java.time.LocalTime.of(20, 0));
        show3.setEndTime(java.time.LocalTime.of(22, 15));
        show3.setCreatedAt(LocalDateTime.now().toString());
        show3 = showRepository.save(show3);
        
        // Initialize seats for shows
        initializeSeats(show1, hall1);
        initializeSeats(show2, hall1);
        initializeSeats(show3, hall2);
        
        System.out.println("Data initialized successfully!");
    }
    
    private void initializeSeats(Show show, Hall hall) {
        int[] capacities = {
            hall.getBalconyCapacity() != null ? hall.getBalconyCapacity() : 30,
            hall.getPremiumCapacity() != null ? hall.getPremiumCapacity() : 40,
            hall.getOrdinaryCapacity() != null ? hall.getOrdinaryCapacity() : 30
        };
        double[] prices = {
            hall.getBalconyPrice() != null ? hall.getBalconyPrice() : 350.0,
            hall.getPremiumPrice() != null ? hall.getPremiumPrice() : 250.0,
            hall.getOrdinaryPrice() != null ? hall.getOrdinaryPrice() : 150.0
        };
        String[] types = {"Balcony", "Premium", "Ordinary"};
        String[] categories = {"BALCONY", "PREMIUM", "ORDINARY"};
        
        int row = 0;
        for (int type = 0; type < 3; type++) {
            for (int i = 0; i < capacities[type]; i++) {
                ShowSeat seat = new ShowSeat();
                seat.setShow(show);
                seat.setRow(String.valueOf((char) ('A' + row)));
                seat.setSeatNumber(String.valueOf(i + 1));
                seat.setSeatType(types[type]);
                seat.setCategory(categories[type]);
                seat.setIsBooked(false);
                seat.setIsBlocked(false);
                seat.setPrice(prices[type]);
                seatRepository.save(seat);
                if ((i + 1) % 10 == 0) row++;
            }
            row++;
        }
    }
}