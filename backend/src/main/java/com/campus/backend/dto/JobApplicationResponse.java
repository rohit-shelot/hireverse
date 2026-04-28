package com.campus.backend.dto;

import com.campus.backend.model.Student;

public class JobApplicationResponse {
    private String id;
    private String status;
    private Student student;
    private String jobTitle;

    public JobApplicationResponse(String id, String status, Student student, String jobTitle) {
        this.id = id;
        this.status = status;
        this.student = student;
        this.jobTitle = jobTitle;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
}
