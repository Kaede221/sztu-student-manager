package com.studentmanager.dto.user;

import com.studentmanager.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Schema(description = "用户 ID")
    @NotNull(message = "用户ID不能为空")
    private Long id;

    @Schema(description = "用户名")
    @NotBlank(message = "用户名不能为空")
    private String username;

    @Schema(description = "密码")
    private String password;

    @Schema(description = "角色 ADMIN | TEACHER | STUDENT")
    @NotNull(message = "用户角色不能为空")
    private UserRole role;

    @Schema(description = "学工编号")
    private String number;

    @Schema(description = "班级 ID")
    private Long classId;

    @Schema(description = "性别")
    private String gender;

    @Schema(description = "手机号")
    private String phoneNumber;

    @Schema(description = "账号状态 是否禁用")
    private Boolean status;
}
