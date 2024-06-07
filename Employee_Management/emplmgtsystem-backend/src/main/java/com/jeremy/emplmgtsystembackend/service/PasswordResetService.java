package com.jeremy.emplmgtsystembackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jeremy.emplmgtsystembackend.entity.OurUsers;
import com.jeremy.emplmgtsystembackend.exception.EmailNotFoundException;
import com.jeremy.emplmgtsystembackend.repository.UsersRepo;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UsersRepo userRepo;

    @Autowired
    private SendGridEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void createPasswordResetToken(String email) {
        OurUsers user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("Email does not exist"));
        String otp = generateOTP();
        user.setOtp(otp);
        System.out.println(otp);
        LocalDateTime expiryTime = LocalDateTime.now().plus(2, ChronoUnit.HOURS);
        user.setTokenExpiry(expiryTime);
        userRepo.save(user);

        try {
            emailService.sendEmail(user.getEmail(), "Password Reset OTP", "Your OTP code is: " + otp);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<OurUsers> userOpt = userRepo.findByResetToken(token);
        if (userOpt.isPresent()) {
            OurUsers user = userOpt.get();
            return user.getTokenExpiry().isAfter(LocalDateTime.now());
        }
        return false;
    }

    public boolean validateOTP(String email, String otp) {
        Optional<OurUsers> userOpt = userRepo.findByEmailAndOtp(email, otp);
        if (userOpt.isPresent()) {
            OurUsers user = userOpt.get();
            return user.getTokenExpiry().isAfter(LocalDateTime.now());
        }
        return false;
    }

    public void updatePassword(String token, String newPassword) {
        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("Token and newPassword cannot be null or empty.");
        }

        OurUsers user = userRepo.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token. Please request a new password reset link."));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepo.save(user);
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String generateToken(String email) {
        OurUsers user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("Email does not exist"));
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpiry(LocalDateTime.now().plus(2, ChronoUnit.HOURS));
        userRepo.save(user);
        return token;
    }
}
