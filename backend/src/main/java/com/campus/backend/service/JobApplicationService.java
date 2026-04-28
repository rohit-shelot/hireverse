package com.campus.backend.service;

import com.campus.backend.model.JobApplication;
import com.campus.backend.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    public JobApplication applyForJob(String studentId, String jobRoleId) {
        if (applicationRepository.existsByStudentIdAndJobRoleId(studentId, jobRoleId)) {
            throw new RuntimeException("Already applied for this job");
        }
        JobApplication application = new JobApplication();
        application.setStudentId(studentId);
        application.setJobRoleId(jobRoleId);
        application.setStatus("APPLIED");
        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsByJob(String jobRoleId) {
        return applicationRepository.findByJobRoleId(jobRoleId);
    }

    public List<JobApplication> getApplicationsByStudent(String studentId) {
        return applicationRepository.findByStudentId(studentId);
    }
}
