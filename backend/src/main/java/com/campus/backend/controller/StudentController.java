package com.campus.backend.controller;

import com.campus.backend.model.JobRole;
import com.campus.backend.model.Student;
import com.campus.backend.service.JobRoleService;
import com.campus.backend.service.StudentService;
import com.campus.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private JobRoleService jobRoleService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobRole>> getAllJobs() {
        return ResponseEntity.ok(jobRoleService.getAllJobs());
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Student> getProfile(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(studentService.getStudentByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<Student> updateProfile(@PathVariable String userId, @RequestBody Student student) {
        try {
            return ResponseEntity.ok(studentService.updateStudentProfile(userId, student));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Autowired
    private JobApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam String studentId, @RequestParam String jobRoleId) {
        try {
            return ResponseEntity.ok(applicationService.applyForJob(studentId, jobRoleId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{studentId}/applied-jobs")
    public ResponseEntity<List<String>> getAppliedJobs(@PathVariable String studentId) {
        List<com.campus.backend.model.JobApplication> apps = applicationService.getApplicationsByStudent(studentId);
        return ResponseEntity.ok(apps.stream().map(app -> app.getJobRoleId()).toList());
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }
}
