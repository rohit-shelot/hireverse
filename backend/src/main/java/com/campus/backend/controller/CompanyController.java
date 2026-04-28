package com.campus.backend.controller;

import com.campus.backend.model.College;
import com.campus.backend.model.Company;
import com.campus.backend.model.JobRole;
import com.campus.backend.service.CollegeService;
import com.campus.backend.service.CompanyService;
import com.campus.backend.service.JobRoleService;
import com.campus.backend.service.JobApplicationService;
import com.campus.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobRoleService jobRoleService;

    @Autowired
    private CollegeService collegeService;

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable String id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Company> getCompanyBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(companyService.getCompanyBySlug(slug));
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Company> getProfile(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(companyService.getCompanyByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<Company> updateProfile(@PathVariable String userId, @RequestBody Company company) {
        try {
            return ResponseEntity.ok(companyService.updateCompanyProfile(userId, company));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobRole> postJob(@RequestBody JobRole jobRole) {
        // Fetch company name to store it in the job role
        Company company = companyService.getCompanyById(jobRole.getCompanyId());
        jobRole.setCompanyName(company.getName());
        
        // Fetch college details if provided
        if (jobRole.getCollegeId() != null && !jobRole.getCollegeId().isEmpty()) {
            College college = collegeService.getCollegeById(jobRole.getCollegeId());
            if (college != null) {
                jobRole.setCollegeName(college.getName());
                jobRole.setCollegeLocation(college.getLocation());
            }
        }
        
        return ResponseEntity.ok(jobRoleService.postJobRole(jobRole));
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobRole> updateJob(@PathVariable String jobId, @RequestBody JobRole jobRole) {
        try {
            // Fetch college details if provided
            if (jobRole.getCollegeId() != null && !jobRole.getCollegeId().isEmpty()) {
                College college = collegeService.getCollegeById(jobRole.getCollegeId());
                if (college != null) {
                    jobRole.setCollegeName(college.getName());
                    jobRole.setCollegeLocation(college.getLocation());
                }
            }
            return ResponseEntity.ok(jobRoleService.updateJobRole(jobId, jobRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Autowired
    private JobApplicationService applicationService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<List<com.campus.backend.dto.JobApplicationResponse>> getApplicants(@PathVariable String jobId) {
        List<com.campus.backend.model.JobApplication> apps = applicationService.getApplicationsByJob(jobId);
        JobRole job = jobRoleService.getJobById(jobId);
        
        List<com.campus.backend.dto.JobApplicationResponse> response = apps.stream().map(app -> {
            com.campus.backend.model.Student student = studentService.getStudentById(app.getStudentId());
            return new com.campus.backend.dto.JobApplicationResponse(
                app.getId(), 
                app.getStatus(), 
                student,
                job.getTitle()
            );
        }).toList();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{companyId}/jobs")
    public ResponseEntity<List<JobRole>> getJobsByCompany(@PathVariable String companyId) {
        return ResponseEntity.ok(jobRoleService.getJobsByCompany(companyId));
    }
}
