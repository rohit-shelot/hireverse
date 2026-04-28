package com.campus.backend.repository;

import com.campus.backend.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface JobRoleRepository extends JpaRepository<JobRole, String> {
    List<JobRole> findByCompanyId(String companyId);
}
