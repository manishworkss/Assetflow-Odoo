package com.assetflow.backend.service;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.VerifyOtpDto;
import com.assetflow.backend.dto.GoogleAuthDto;
import com.assetflow.backend.dto.JwtAuthResponse;
import com.assetflow.backend.dto.ForgotPasswordDto;
import com.assetflow.backend.dto.ResetPasswordDto;

/**
 * Service interface for user authentication and authorization.
 * Defines business logic methods for login and signup.
 */
public interface AuthService {
    String signup(SignupDto signupDto);
    JwtAuthResponse login(LoginDto loginDto);
    JwtAuthResponse verifyOtp(VerifyOtpDto verifyOtpDto);
    JwtAuthResponse googleAuth(GoogleAuthDto googleAuthDto);
    String resendOtp(String email);
    String forgotPassword(ForgotPasswordDto forgotPasswordDto);
    String resetPassword(ResetPasswordDto resetPasswordDto);
}
