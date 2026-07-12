package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
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
}
