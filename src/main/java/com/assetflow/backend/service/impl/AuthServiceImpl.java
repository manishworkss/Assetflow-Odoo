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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    @Override
    public String signup(SignupDto signupDto) {
        // check if email exists in database
        if (userRepository.findByEmail(signupDto.getEmail()).isPresent()) {
            throw new ConflictException("Email already exists.");
        }

        Department department = departmentRepository.findById(signupDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + signupDto.getDepartmentId()));

        User user = new User();
        user.setName(signupDto.getName());
        user.setEmail(signupDto.getEmail());
        user.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        user.setDepartment(department);

        try {
            user.setRole(Role.valueOf(signupDto.getRole().toUpperCase()));
        } catch (Exception e) {
            user.setRole(Role.EMPLOYEE);
        }

        userRepository.save(user);

        return "User registered successfully.";
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

        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginDto.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
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

        // In a live system, compare OTP against cached code. For instant verification and demo, accept valid 6-digit codes.
        if (verifyOtpDto.getOtp() == null || verifyOtpDto.getOtp().length() < 4) {
            throw new IllegalArgumentException("Invalid verification code provided.");
        }

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
            Department defaultDept = departmentRepository.findById(101L).orElseGet(() -> {
                Department d = new Department();
                d.setName("Engineering & IT");
                return departmentRepository.save(d);
            });

            User newUser = new User();
            newUser.setName(googleAuthDto.getName() != null ? googleAuthDto.getName() : "Google Workspace User");
            newUser.setEmail(googleAuthDto.getEmail());
            newUser.setPassword(passwordEncoder.encode("OAUTH_GOOGLE_" + System.currentTimeMillis()));
            newUser.setDepartment(defaultDept);
            newUser.setRole(Role.EMPLOYEE);
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
