package com.assetflow.backend.service;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.VerifyOtpDto;
import com.assetflow.backend.dto.GoogleAuthDto;
import com.assetflow.backend.dto.JwtAuthResponse;

/**
 * Service interface for user authentication and authorization.
 * Defines business logic methods for login and signup.
 */
public interface AuthService {
    String signup(SignupDto signupDto);
    JwtAuthResponse login(LoginDto loginDto);
    JwtAuthResponse verifyOtp(VerifyOtpDto verifyOtpDto);
    JwtAuthResponse googleAuth(GoogleAuthDto googleAuthDto);
}
