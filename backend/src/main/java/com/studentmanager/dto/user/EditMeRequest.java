package com.studentmanager.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EditMeRequest {
    @Schema(description = "用户性别")
    private String gender;

    @Schema(description = "用户手机号")
    private String phoneNumber;
}
