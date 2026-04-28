package com.campus.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "campus_jobs")
public class JobRole {
    @Id
    private String id;
    private String companyId;
    private String companyName;
    private String collegeId;
    private String collegeName;
    private String collegeLocation;
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private double minCgpa;
    private double minTenthPercentage;
    private double minTwelfthPercentage;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCompanyId() { return companyId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    public String getCollegeLocation() { return collegeLocation; }
    public void setCollegeLocation(String collegeLocation) { this.collegeLocation = collegeLocation; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(double minCgpa) { this.minCgpa = minCgpa; }
    public double getMinTenthPercentage() { return minTenthPercentage; }
    public void setMinTenthPercentage(double minTenthPercentage) { this.minTenthPercentage = minTenthPercentage; }
    public double getMinTwelfthPercentage() { return minTwelfthPercentage; }
    public void setMinTwelfthPercentage(double minTwelfthPercentage) { this.minTwelfthPercentage = minTwelfthPercentage; }
}
