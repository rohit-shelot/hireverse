package com.campus.backend.controller;

import com.campus.backend.dto.AuthRequest;
import com.campus.backend.dto.AuthResponse;
import com.campus.backend.dto.StudentRegistrationDTO;
import com.campus.backend.model.Role;
import com.campus.backend.model.User;
import com.campus.backend.repository.UserRepository;
import com.campus.backend.security.JwtUtils;
import com.campus.backend.service.CompanyService;
import com.campus.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            if (user.getRole() == Role.ROLE_STUDENT && !user.isVerified()) {
                return ResponseEntity.status(403).body("Account not verified. Please verify your OTP.");
            }
            String token = jwtUtils.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getRole()));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return ResponseEntity.badRequest().body("No active OTP found. Please request a new one.");
        }

        // Check Expiry
        if (System.currentTimeMillis() > user.getOtpExpiry()) {
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            return ResponseEntity.status(410).body("OTP has expired. Please register again or request a new code.");
        }
        
        // Verify Code
        if (user.getOtp().equals(otp)) {
            user.setVerified(true);
            user.setOtp(null); // one-time use
            user.setOtpExpiry(null);
            userRepository.save(user);
            return ResponseEntity.ok("Verification successful!");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }

    @PostMapping("/signup/student")
    public ResponseEntity<?> signupStudent(@RequestBody StudentRegistrationDTO dto) {
        try {
            return ResponseEntity.ok(studentService.registerStudent(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signup/company")
    public ResponseEntity<?> signupCompany(@RequestBody com.campus.backend.dto.CompanyRegistrationDTO dto) {
        try {
            return ResponseEntity.ok(companyService.registerCompany(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
