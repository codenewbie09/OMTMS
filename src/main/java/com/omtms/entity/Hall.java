package com.omtms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hall")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hall_id")
    private Long hallId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "balcony_capacity")
    private Integer balconyCapacity = 30;

    @Column(name = "premium_capacity")
    private Integer premiumCapacity = 40;

    @Column(name = "ordinary_capacity")
    private Integer ordinaryCapacity = 30;

    @Column(name = "balcony_price")
    private Double balconyPrice = 350.0;

    @Column(name = "premium_price")
    private Double premiumPrice = 250.0;

    @Column(name = "ordinary_price")
    private Double ordinaryPrice = 150.0;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;
}