package com.jeremy.emplmgtsystembackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jeremy.emplmgtsystembackend.entity.OurUsers;
import com.jeremy.emplmgtsystembackend.repository.UsersRepo;

@Service
public class UserServiceImpl implements UserService {

    private final UsersRepo usersRepo;

    @Autowired
    public UserServiceImpl(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        OurUsers user = usersRepo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.getAuthorities());
    }

    @Override
    public OurUsers findByEmail(String email) {
        return usersRepo.findByEmail(email).orElse(null);
    }
}
