package com.campus.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String userId; // Link to User
    private String name;
    private double cgpa;
    private double tenthPercentage;
    private double twelfthPercentage;
    
    @ElementCollection
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private List<String> skills;
    
    private String location;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }
    public double getTenthPercentage() { return tenthPercentage; }
    public void setTenthPercentage(double tenthPercentage) { this.tenthPercentage = tenthPercentage; }
    public double getTwelfthPercentage() { return twelfthPercentage; }
    public void setTwelfthPercentage(double twelfthPercentage) { this.twelfthPercentage = twelfthPercentage; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
