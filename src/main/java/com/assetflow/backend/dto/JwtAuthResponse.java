package com.assetflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserDto user;

    public JwtAuthResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
