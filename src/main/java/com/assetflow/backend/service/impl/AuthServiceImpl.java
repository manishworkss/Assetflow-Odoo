package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.VerifyOtpDto;
import com.assetflow.backend.dto.GoogleAuthDto;
import com.assetflow.backend.dto.UserDto;
import com.assetflow.backend.dto.JwtAuthResponse;
import com.assetflow.backend.dto.ForgotPasswordDto;
import com.assetflow.backend.dto.ResetPasswordDto;
import com.assetflow.backend.entity.Department;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.Role;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.DepartmentRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.security.JwtTokenProvider;
import com.assetflow.backend.service.AuthService;
import com.assetflow.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

@Service
/**
 * Implementation of the {@link AuthService} interface.
 * Handles the business logic for user authentication, registration, and role assignment.
 */
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    @Value("${google.client.id}")
    private String googleClientId;

    @Override
    public String signup(SignupDto signupDto) {
        // check if email exists in database
        if (userRepository.findByEmail(signupDto.getEmail()).isPresent()) {
            throw new ConflictException("Email already exists.");
        }

        Department department = null;
        if (signupDto.getDepartmentId() != null) {
            department = departmentRepository.findById(signupDto.getDepartmentId()).orElse(null);
        }
        if (department == null) {
            department = departmentRepository.findAll().stream().findFirst()
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName("Engineering & IT");
                        d.setDescription("Core Enterprise IT Department");
                        return departmentRepository.save(d);
                    });
        }

        String otpCode = String.format("%06d", new SecureRandom().nextInt(1000000));

        User user = new User();
        user.setName(signupDto.getName());
        user.setEmail(signupDto.getEmail());
        user.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        user.setDepartment(department);
        user.setVerificationCode(otpCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
        user.setVerified(false);

        user.setRole(Role.EMPLOYEE);

        userRepository.save(user);

        // Dispatch 6-digit OTP verification code via email
        emailService.sendOtpVerificationEmail(user.getEmail(), user.getName(), otpCode);
        
        System.out.println("====== DEV MODE: OTP GENERATED ====== -> " + otpCode);

        return "Verification code sent to " + user.getEmail();
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginDto.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isVerified() && user.getVerificationCode() != null) {
            throw new IllegalArgumentException("Account is pending verification. Please verify your email with the 6-digit OTP code.");
        }

        String token = jwtTokenProvider.generateToken(authentication);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .departmentId(user.getDepartment().getId())
                .departmentName(user.getDepartment().getName())
                .build();

        return new JwtAuthResponse(token, userDto);
    }

    @Override
    public JwtAuthResponse verifyOtp(VerifyOtpDto verifyOtpDto) {
        User user = userRepository.findByEmail(verifyOtpDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + verifyOtpDto.getEmail()));

        if (user.getVerificationCode() == null) {
            throw new IllegalArgumentException("No active verification request found or account is already verified.");
        }

        if (verifyOtpDto.getOtp() == null || !verifyOtpDto.getOtp().trim().equals(user.getVerificationCode())) {
            throw new IllegalArgumentException("Invalid verification code. Please check your email and enter the exact 6-digit code.");
        }

        if (user.getVerificationCodeExpiresAt() != null && LocalDateTime.now().isAfter(user.getVerificationCodeExpiresAt())) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new verification code.");
        }

        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setVerified(true);
        userRepository.save(user);

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .departmentId(user.getDepartment().getId())
                .departmentName(user.getDepartment().getName())
                .build();

        return new JwtAuthResponse(token, userDto);
    }

    @Override
    public JwtAuthResponse googleAuth(GoogleAuthDto googleAuthDto) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(googleAuthDto.getCredential());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Google credential token");
        }

        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google credential token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Department defaultDept = departmentRepository.findAll().stream().findFirst().orElseGet(() -> {
                Department d = new Department();
                d.setName("Engineering & IT");
                d.setDescription("Core Enterprise IT Department");
                return departmentRepository.save(d);
            });

            User newUser = new User();
            newUser.setName(name != null ? name : "Google Workspace User");
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode("OAUTH_GOOGLE_" + System.currentTimeMillis()));
            newUser.setDepartment(defaultDept);
            newUser.setRole(Role.EMPLOYEE);
            newUser.setVerified(true);
            return userRepository.save(newUser);
        });

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .departmentId(user.getDepartment().getId())
                .departmentName(user.getDepartment().getName())
                .build();

        return new JwtAuthResponse(token, userDto);
    }

    @Override
    public String resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found for email: " + email + ". Please register first."));

        if (user.isVerified()) {
            throw new IllegalArgumentException("Account is already verified. Please login.");
        }

        String newOtpCode = String.format("%06d", new SecureRandom().nextInt(1000000));
        user.setVerificationCode(newOtpCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpVerificationEmail(user.getEmail(), user.getName(), newOtpCode);
        
        System.out.println("====== DEV MODE: RESEND OTP ====== -> " + newOtpCode);

        return "A new verification code has been sent to " + user.getEmail();
    }

    @Override
    public String forgotPassword(ForgotPasswordDto forgotPasswordDto) {
        User user = userRepository.findByEmail(forgotPasswordDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account found for email: " + forgotPasswordDto.getEmail()));

        String resetToken = java.util.UUID.randomUUID().toString();
        user.setVerificationCode(resetToken);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Ideally send an email with the reset link. 
        // We will just send the token via email for now, similar to OTP.
        emailService.sendOtpVerificationEmail(user.getEmail(), user.getName(), resetToken);
        
        System.out.println("====== DEV MODE: RESET TOKEN ====== -> " + resetToken);

        return "Password reset instructions have been sent to your email";
    }

    @Override
    public String resetPassword(ResetPasswordDto resetPasswordDto) {
        User user = userRepository.findByEmail(resetPasswordDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account found for email: " + resetPasswordDto.getEmail()));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(resetPasswordDto.getToken())) {
            throw new IllegalArgumentException("Invalid reset token");
        }

        if (user.getVerificationCodeExpiresAt() != null && user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);

        return "Password has been successfully reset";
    }
}
