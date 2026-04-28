package com.campus.backend.repository;

import com.campus.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, String> {
    List<JobApplication> findByStudentId(String studentId);
    List<JobApplication> findByJobRoleId(String jobRoleId);
    boolean existsByStudentIdAndJobRoleId(String studentId, String jobRoleId);
}
