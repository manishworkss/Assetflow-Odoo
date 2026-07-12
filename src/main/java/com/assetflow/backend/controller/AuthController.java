package com.assetflow.backend.controller;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.VerifyOtpDto;
import com.assetflow.backend.dto.GoogleAuthDto;
import com.assetflow.backend.dto.JwtAuthResponse;
import com.assetflow.backend.dto.ForgotPasswordDto;
import com.assetflow.backend.dto.ResetPasswordDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
/**
 * REST controller for handling user authentication and registration.
 * Provides endpoints for signing up and logging in users.
 */
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody SignupDto signupDto) {
        String response = authService.signup(signupDto);
        return new ResponseEntity<>(ApiResponse.success("Signup successful. Please verify OTP.", response), HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpDto verifyOtpDto) {
        JwtAuthResponse jwtAuthResponse = authService.verifyOtp(verifyOtpDto);
        return ResponseEntity.ok(ApiResponse.success("OTP Verified Successfully", jwtAuthResponse));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> googleAuth(@Valid @RequestBody GoogleAuthDto googleAuthDto) {
        JwtAuthResponse jwtAuthResponse = authService.googleAuth(googleAuthDto);
        return ResponseEntity.ok(ApiResponse.success("Google OAuth Login Successful", jwtAuthResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginDto loginDto) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtAuthResponse));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        String response = authService.resendOtp(email);
        return ResponseEntity.ok(ApiResponse.success("Verification code resent", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {
        String response = authService.forgotPassword(forgotPasswordDto);
        return ResponseEntity.ok(ApiResponse.success("Forgot password email sent", response));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        String response = authService.resetPassword(resetPasswordDto);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful", response));
    }
}
