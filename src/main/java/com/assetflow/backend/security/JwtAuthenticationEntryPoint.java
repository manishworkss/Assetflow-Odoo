package com.assetflow.backend.security;

import com.assetflow.backend.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
/**
 * Returns a clean JSON 401 Unauthorized response (matching our ApiResponse structure)
 * when an unauthenticated request tries to access a protected resource.
 */
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @org.springframework.beans.factory.annotation.Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.error(
            "Authentication required. Invalid credentials or session expired."
        );
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
