package com.campus.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOtp(String to, String otp) {
        if (mailSender == null) {
            System.out.println("MailSender not configured. OTP for " + to + " is: " + otp);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Account Verification OTP");
            message.setText("Your OTP for account verification is: " + otp + "\n\nThis OTP is valid for 10 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            System.out.println("FALLBACK: OTP for " + to + " is: " + otp);
        }
    }
}
