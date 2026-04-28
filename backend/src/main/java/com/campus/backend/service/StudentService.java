package com.campus.backend.service;

import com.campus.backend.dto.StudentRegistrationDTO;
import com.campus.backend.model.Role;
import com.campus.backend.model.Student;
import com.campus.backend.model.User;
import com.campus.backend.repository.StudentRepository;
import com.campus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.security.SecureRandom;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student registerStudent(StudentRegistrationDTO dto) {
        // 0. Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 1. Create User
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_STUDENT);
        
        // MFA: Generate Secure OTP
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);
        
        user.setOtp(otp);
        user.setOtpExpiry(System.currentTimeMillis() + 300000); // 5 minutes expiry
        user.setVerified(false);
        
        user = userRepository.save(user);

        // MFA: Send OTP
        emailService.sendOtp(user.getEmail(), otp);

        // 2. Create Student profile
        Student student = new Student();
        student.setUserId(user.getId());
        student.setName(dto.getName());
        student.setCgpa(dto.getCgpa());
        student.setTenthPercentage(dto.getTenthPercentage());
        student.setTwelfthPercentage(dto.getTwelfthPercentage());
        student.setSkills(dto.getSkills());
        student.setLocation(dto.getLocation());

        return studentRepository.save(student);
    }
    public void deleteStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        userRepository.deleteById(student.getUserId());
        studentRepository.deleteById(studentId);
    }

    public Student getStudentByUserId(String userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    public Student updateStudentProfile(String userId, Student updatedStudent) {
        Student existingStudent = getStudentByUserId(userId);
        
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setCgpa(updatedStudent.getCgpa());
        existingStudent.setTenthPercentage(updatedStudent.getTenthPercentage());
        existingStudent.setTwelfthPercentage(updatedStudent.getTwelfthPercentage());
        existingStudent.setSkills(updatedStudent.getSkills());
        existingStudent.setLocation(updatedStudent.getLocation());

        // Also update User name
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setName(updatedStudent.getName());
            userRepository.save(user);
        }

        return studentRepository.save(existingStudent);
    }
    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}
