package com.assetflow.backend.service.impl;

import com.assetflow.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Implementation of {@link EmailService} that sends secure verification emails using Spring JavaMailSender.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:no-reply@assetflow.enterprise}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Override
    public void sendOtpVerificationEmail(String toEmail, String name, String otpCode) {
        String subject = "AssetFlow Enterprise - Your Security Verification Code";
        String body = String.format(
            "Hello %s,\n\n" +
            "To complete your registration with AssetFlow Enterprise Suite, please enter the following 6-digit verification code:\n\n" +
            "===========================\n" +
            "   SECURITY CODE: %s\n" +
            "===========================\n\n" +
            "This code is valid for 10 minutes. If you did not request this code, please ignore this email or contact your IT security administrator.\n\n" +
            "Best regards,\n" +
            "AssetFlow Security & Identity Team",
            name, otpCode
        );

        // If live SMTP settings are provided, send via JavaMailSender
        if (javaMailSender != null && mailPassword != null && !mailPassword.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                javaMailSender.send(message);
                logger.info("Successfully dispatched OTP verification email to {}", toEmail);
                return;
            } catch (Exception ex) {
                logger.warn("SMTP email dispatch failed (using fallback simulation): {}", ex.getMessage());
            }
        }

        // Professional Enterprise Simulation & Audit Log (when SMTP is not configured)
        logger.info("\n" +
                "=========================================================================\n" +
                "[ENTERPRISE EMAIL SERVICE DISPATCH]\n" +
                "To:      {}\n" +
                "From:    {}\n" +
                "Subject: {}\n" +
                "-------------------------------------------------------------------------\n" +
                "Hello {},\n\n" +
                "Your 6-digit verification code to access AssetFlow Enterprise is:\n\n" +
                " ---> [{}] <---\n\n" +
                "This code expires in 10 minutes from dispatch.\n" +
                "=========================================================================",
                toEmail, fromEmail, subject, name, otpCode);
    }
}
