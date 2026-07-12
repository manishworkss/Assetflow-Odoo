package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.VerifyOtpDto;
import com.assetflow.backend.dto.GoogleAuthDto;
import com.assetflow.backend.dto.UserDto;
import com.assetflow.backend.dto.JwtAuthResponse;
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

@Service
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

        try {
            user.setRole(Role.valueOf(signupDto.getRole().toUpperCase()));
        } catch (Exception e) {
            user.setRole(Role.EMPLOYEE);
        }

        userRepository.save(user);

        // Dispatch 6-digit OTP verification code via email
        emailService.sendOtpVerificationEmail(user.getEmail(), user.getName(), otpCode);

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
        User user = userRepository.findByEmail(googleAuthDto.getEmail()).orElseGet(() -> {
            Department defaultDept = departmentRepository.findAll().stream().findFirst().orElseGet(() -> {
                Department d = new Department();
                d.setName("Engineering & IT");
                d.setDescription("Core Enterprise IT Department");
                return departmentRepository.save(d);
            });

            User newUser = new User();
            newUser.setName(googleAuthDto.getName() != null ? googleAuthDto.getName() : "Google Workspace User");
            newUser.setEmail(googleAuthDto.getEmail());
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
}
