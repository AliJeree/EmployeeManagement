package com.jeremy.emplmgtsystembackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jeremy.emplmgtsystembackend.entity.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
}
