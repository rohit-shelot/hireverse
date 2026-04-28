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

    @Autowired
    private com.campus.backend.repository.CompanyRepository companyRepository;

    @org.springframework.beans.factory.annotation.Value("${admin.email}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Remove old admin if exists
        userRepository.findByEmail("admin@campus.com").ifPresent(user -> {
            userRepository.delete(user);
            System.out.println("Old admin admin@campus.com removed.");
        });

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            user -> {
                user.setRole(Role.ROLE_ADMIN);
                user.setPassword(passwordEncoder.encode(adminPassword));
                user.setName("System Admin");
                userRepository.save(user);
                System.out.println("Admin updated: " + adminEmail);
            },
            () -> {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ROLE_ADMIN);
                admin.setVerified(true);
                userRepository.save(admin);
                System.out.println("Default Admin created: " + adminEmail);
            }
        );

        // Migration: Ensure all existing companies have slugs
        companyRepository.findAll().forEach(company -> {
            if (company.getSlug() == null || company.getSlug().isEmpty()) {
                String slug = company.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
                if (slug.endsWith("-")) slug = slug.substring(0, slug.length() - 1);
                company.setSlug(slug);
                companyRepository.save(company);
                System.out.println("Migrated slug for company: " + company.getName());
            }
        });
    }
}
