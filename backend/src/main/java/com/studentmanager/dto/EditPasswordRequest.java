package com.studentmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EditPasswordRequest {
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
}
