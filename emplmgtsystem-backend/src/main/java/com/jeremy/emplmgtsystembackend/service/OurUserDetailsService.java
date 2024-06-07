package com.jeremy.emplmgtsystembackend.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jeremy.emplmgtsystembackend.entity.OurUsers;
import com.jeremy.emplmgtsystembackend.exception.EmailAlreadyExistsException;
import com.jeremy.emplmgtsystembackend.repository.UsersRepo;

@Service
public class OurUserDetailsService implements UserDetailsService {

	final UsersRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public OurUserDetailsService(UsersRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    public UsersRepo getUserRepo() {
        return userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	return userRepo.findByEmail(username).orElseThrow();
    }	

  //making pagination dynamic for both db results and search results
    public Page<OurUsers> searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (query == null || query.isEmpty()) {
            return userRepo.findAll(pageable);
        }
        return userRepo.searchUsers(query, pageable);
    }

    // Backend pagination
    public Page<OurUsers> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepo.findAll(pageable);
    }

    public OurUsers registerUser(OurUsers user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); 
        return userRepo.save(user);
    }

    public boolean doesEmailExist(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}


    
   /* @Autowired
    private PasswordEncoder passwordEncoder;

    public void generateRandomUsers(int count) {
        for (int i = 0; i < count; i++) {
            OurUsers user = new OurUsers();
            user.setEmail(generateRandomEmail());
            user.setFirstname(generateRandomName());
            user.setLastname(generateRandomName());
            user.setPassword(passwordEncoder.encode("1234"));
            user.setCity(generateRandomCity());
            user.setRole("USER");
            user.setJob(generateRandomJob());
            user.setResetToken(null);
            user.setTokenExpiry(null);
            user.setOtp(null);

            userRepo.save(user);
        }
    }

    private String generateRandomEmail() {
        return "user" + generateRandomString(5) + "@example.com";
    }

    private String generateRandomName() {
        String[] names = {"John", "Alice", "Bob", "Emma", "Michael", "Sophia", "David", "Olivia"};
        return names[new Random().nextInt(names.length)];
    }

    private String generateRandomCity() {
        String[] cities = {"New York", "Los Angeles", "London", "Paris", "Tokyo", "Berlin", "Sydney"};
        return cities[new Random().nextInt(cities.length)];
    }

    private String generateRandomJob() {
        String[] jobs = {"Engineer", "Teacher", "Doctor", "Artist", "Accountant", "Designer", "Writer", "Developer"};
        return jobs[new Random().nextInt(jobs.length)];
    }

    private String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = new Random().nextInt(characters.length());
            stringBuilder.append(characters.charAt(index));
        }
        return stringBuilder.toString();
    }
}
*/
