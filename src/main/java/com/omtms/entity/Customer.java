package com.omtms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "loyalty_id")
    private String loyaltyId;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "purchase_count")
    private Integer purchaseCount = 0;

    @Column(name = "total_spent")
    private Double totalSpent = 0.0;

    @Column(name = "is_loyalty_member")
    private Boolean isLoyaltyMember = false;
}
