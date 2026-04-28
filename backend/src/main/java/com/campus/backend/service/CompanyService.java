package com.campus.backend.service;

import com.campus.backend.dto.CompanyRegistrationDTO;
import com.campus.backend.model.Company;
import com.campus.backend.model.Role;
import com.campus.backend.model.User;
import com.campus.backend.repository.CompanyRepository;
import com.campus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company registerCompany(CompanyRegistrationDTO dto) {
        // 1. Check if email exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 2. Create User
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_COMPANY);
        
        // No MFA for Companies: Auto-verify
        user.setVerified(true);
        user.setOtp(null);
        
        user = userRepository.save(user);

        // 3. Create Company profile
        Company company = new Company();
        company.setUserId(user.getId());
        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setLocation(dto.getLocation());

        return companyRepository.save(company);
    }
    public void deleteCompany(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        userRepository.deleteById(company.getUserId());
        companyRepository.deleteById(companyId);
    }

    public Company getCompanyByUserId(String userId) {
        return companyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));
    }

    public Company getCompanyById(String companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    public Company updateCompanyProfile(String userId, Company updatedCompany) {
        Company existingCompany = getCompanyByUserId(userId);
        
        existingCompany.setName(updatedCompany.getName());
        existingCompany.setIndustry(updatedCompany.getIndustry());
        existingCompany.setLocation(updatedCompany.getLocation());

        // Also update User name
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setName(updatedCompany.getName());
            userRepository.save(user);
        }

        return companyRepository.save(existingCompany);
    }
}
