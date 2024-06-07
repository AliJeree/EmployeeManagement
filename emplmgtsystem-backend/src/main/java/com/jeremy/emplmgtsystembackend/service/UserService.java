package com.jeremy.emplmgtsystembackend.service;


import org.springframework.security.core.userdetails.UserDetailsService;

import com.jeremy.emplmgtsystembackend.entity.OurUsers;

public interface UserService extends UserDetailsService {
    OurUsers findByEmail(String email);
}
