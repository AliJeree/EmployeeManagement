package com.jeremy.emplmgtsystembackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jeremy.emplmgtsystembackend.entity.OurUsers;

public interface UsersRepo extends JpaRepository<OurUsers, Integer> {
	
	Optional<OurUsers> findByEmail(String email);
	
	Optional<OurUsers> findByResetToken(String resetToken);
	
	//making pagination dynamic for both db results and search results
	@Query("SELECT u FROM OurUsers u WHERE " +
	           "LOWER(u.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	           "LOWER(u.lastname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	           "LOWER(u.job) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	           "LOWER(u.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	           "LOWER(u.role) LIKE LOWER(CONCAT('%', :query, '%'))")
	    Page<OurUsers> searchUsers(@Param("query") String query, Pageable pageable);
	 
	 Optional<OurUsers> findByEmailAndOtp(String email, String otp);
	 
	//backend pagination
	 Page<OurUsers> findAll(Pageable pageable);
	 
	 List<OurUsers> findByJobIn(List<String> jobTitles);
	 

}
