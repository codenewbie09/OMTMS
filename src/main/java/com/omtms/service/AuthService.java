package com.omtms.service;

import com.omtms.dto.AuthResponse;
import com.omtms.dto.LoginRequest;
import com.omtms.dto.RegisterRequest;
import com.omtms.entity.Admin;
import com.omtms.entity.Customer;
import com.omtms.entity.User;
import com.omtms.repository.AdminRepository;
import com.omtms.repository.CustomerRepository;
import com.omtms.repository.UserRepository;
import com.omtms.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    public AuthService(UserRepository userRepository, 
                       CustomerRepository customerRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);
        
        if ("CUSTOMER".equals(request.getRole())) {
            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setCreatedAt(LocalDateTime.now().toString());
            customerRepository.save(customer);
        } else if ("ADMIN".equals(request.getRole())) {
            Admin admin = new Admin();
            admin.setUser(savedUser);
            admin.setCreatedAt(LocalDateTime.now().toString());
            adminRepository.save(admin);
        }
        
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getUserId());
        return new AuthResponse(token, savedUser.getRole(), savedUser.getUserId());
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());
        return new AuthResponse(token, user.getRole(), user.getUserId());
    }
}
