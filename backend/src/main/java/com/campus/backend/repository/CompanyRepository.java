package com.campus.backend.repository;

import com.campus.backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {
    Optional<Company> findByUserId(String userId);
    Optional<Company> findBySlug(String slug);
}
