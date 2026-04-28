package com.campus.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String studentId;
    private String jobRoleId;
    private String status; // APPLIED, REJECTED, ACCEPTED

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getJobRoleId() { return jobRoleId; }
    public void setJobRoleId(String jobRoleId) { this.jobRoleId = jobRoleId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
