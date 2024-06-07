package com.jeremy.emplmgtsystembackend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers ourUser;
    
    private BigDecimal salary;
    
    private LocalDate datepaid;
    
    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
    
    public LocalDate getdatePaid() {
        return datepaid;
    }

    public void setdatePaid(LocalDate datepaid) {
        this.datepaid = datepaid;
    }

}