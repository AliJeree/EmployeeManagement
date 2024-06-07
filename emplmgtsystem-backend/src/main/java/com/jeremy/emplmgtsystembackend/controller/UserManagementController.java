package com.jeremy.emplmgtsystembackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;

import com.jeremy.emplmgtsystembackend.dto.EmailRequest;
import com.jeremy.emplmgtsystembackend.dto.ReqRes;
import com.jeremy.emplmgtsystembackend.entity.OurUsers;
import com.jeremy.emplmgtsystembackend.exception.EmailAlreadyExistsException;
import com.jeremy.emplmgtsystembackend.exception.EmailNotFoundException;
import com.jeremy.emplmgtsystembackend.service.OurUserDetailsService;
import com.jeremy.emplmgtsystembackend.service.PasswordResetService;
import com.jeremy.emplmgtsystembackend.service.SendGridEmailService;
import com.jeremy.emplmgtsystembackend.service.UserEmailService;
import com.jeremy.emplmgtsystembackend.service.UsersManagementService;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserManagementController {

    @Autowired
    private UsersManagementService usersManagementService;

    @Autowired
    private PasswordResetService passwordResetService;
    
    @Autowired
    private SendGridEmailService sendGridEmailService;
    
    @Autowired
    private UserEmailService userEmailService;
    

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody OurUsers user) {
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/check-email")
    public ResponseEntity<Boolean> checkEmailUnique(@RequestParam String email) {
        boolean isUnique = !userService.doesEmailExist(email);
        return ResponseEntity.ok(isUnique);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            passwordResetService.createPasswordResetToken(email);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (EmailNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            String token = payload.get("token");
            String newPassword = payload.get("newPassword");

            if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
                throw new IllegalArgumentException("Token and newPassword cannot be null or empty.");
            }

            passwordResetService.updatePassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token and newPassword cannot be null or empty");
        }
    }

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = passwordResetService.validateOTP(email, otp);
        Map<String, Object> response = new HashMap<>();
        if (isValid) {
            String token = passwordResetService.generateToken(email);
            response.put("isValid", true);
            response.put("token", token);
        } else {
            response.put("isValid", false);
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/admin/send-email-to-all")
    public ResponseEntity<String> sendEmailToAllUsers(@RequestBody EmailRequest emailRequest) {
        userEmailService.sendEmailToAllUsers(emailRequest.getSubject(), emailRequest.getBody());
        return ResponseEntity.ok("Emails sent successfully");
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserByID(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @Autowired
    private OurUserDetailsService userService;

    //making pagination dynamic for both db results and search results
    @GetMapping("/admin/search-users")
    public ResponseEntity<Page<OurUsers>> searchUsers(
        @RequestParam(required = false) String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "7") int size) {
        Page<OurUsers> users = userService.searchUsers(query, page, size);
        return ResponseEntity.ok(users);
    }
    
    @CrossOrigin
    @PostMapping("/admin/send-emails")
    public ResponseEntity<String> sendEmailsByJobTitles(@RequestBody EmailRequest emailRequest) {
        try {
            userEmailService.sendEmailToUsersByJob(emailRequest.getSubject(), emailRequest.getBody(), emailRequest.getJobTitles());
            return ResponseEntity.ok("Emails sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send emails: " + e.getMessage());
        }
    }
    
  //backend pagination
    @GetMapping("/users")
    public Page<OurUsers> getUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "7") int size) {
        return userService.getAllUsers(page, size);
    }
}

