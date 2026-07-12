package com.assetflow.backend.service;

import com.assetflow.backend.dto.LoginDto;
import com.assetflow.backend.dto.SignupDto;
import com.assetflow.backend.dto.JwtAuthResponse;

public interface AuthService {
    String signup(SignupDto signupDto);
    JwtAuthResponse login(LoginDto loginDto);
}
