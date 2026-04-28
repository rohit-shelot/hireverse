package com.campus.backend.service;

import com.campus.backend.model.Company;
import com.campus.backend.model.JobRole;
import com.campus.backend.repository.CompanyRepository;
import com.campus.backend.repository.JobRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class JobRoleService {

    @Autowired
    private JobRoleRepository jobRoleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public JobRole postJobRole(JobRole jobRole) {
        if (jobRole.getId() == null || jobRole.getId().isEmpty()) {
            jobRole.setId(UUID.randomUUID().toString());
        }
        return jobRoleRepository.save(jobRole);
    }

    public List<JobRole> getJobsByCompany(String companyId) {
        List<JobRole> jobs = jobRoleRepository.findByCompanyId(companyId);
        for (JobRole job : jobs) {
            if (job.getCompanyName() == null || job.getCompanyName().isEmpty()) {
                companyRepository.findById(job.getCompanyId()).ifPresent(c -> job.setCompanyName(c.getName()));
            }
        }
        return jobs;
    }

    public JobRole updateJobRole(String jobId, JobRole updatedJob) {
        JobRole existingJob = jobRoleRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job role not found"));
        
        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setMinCgpa(updatedJob.getMinCgpa());
        existingJob.setMinTenthPercentage(updatedJob.getMinTenthPercentage());
        existingJob.setMinTwelfthPercentage(updatedJob.getMinTwelfthPercentage());
        
        // Update college fields
        existingJob.setCollegeId(updatedJob.getCollegeId());
        existingJob.setCollegeName(updatedJob.getCollegeName());
        existingJob.setCollegeLocation(updatedJob.getCollegeLocation());
        
        return jobRoleRepository.save(existingJob);
    }

    public List<JobRole> getAllJobs() {
        List<JobRole> jobs = jobRoleRepository.findAll();
        for (JobRole job : jobs) {
            if (job.getCompanyName() == null || job.getCompanyName().isEmpty()) {
                companyRepository.findById(job.getCompanyId()).ifPresent(c -> job.setCompanyName(c.getName()));
            }
        }
        return jobs;
    }
    public JobRole getJobById(String jobId) {
        return jobRoleRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
    }
}
