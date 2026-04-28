package com.campus.backend.config;

import com.campus.backend.model.Role;
import com.campus.backend.model.User;
import com.campus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Remove old admin if exists
        userRepository.findByEmail("admin@campus.com").ifPresent(user -> {
            userRepository.delete(user);
            System.out.println("Old admin admin@campus.com removed.");
        });

        userRepository.findByEmail("hireverse@gmail.com").ifPresentOrElse(
            user -> {
                user.setRole(Role.ROLE_ADMIN);
                user.setPassword(passwordEncoder.encode("hireverse"));
                user.setName("System Admin");
                userRepository.save(user);
                System.out.println("Admin updated: hireverse@gmail.com / hireverse");
            },
            () -> {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("hireverse@gmail.com");
                admin.setPassword(passwordEncoder.encode("hireverse"));
                admin.setRole(Role.ROLE_ADMIN);
                admin.setVerified(true);
                userRepository.save(admin);
                System.out.println("Default Admin created: hireverse@gmail.com / hireverse");
            }
        );
    }
}
