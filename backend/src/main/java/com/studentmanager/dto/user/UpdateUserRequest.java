package com.studentmanager.dto.user;

import com.studentmanager.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {
    /**
     * 用户唯一 ID
     */
    @NotNull(message = "用户ID不能为空")
    private Long id;
    /**
     * 用户名 唯一字段
     */
    @NotBlank(message = "用户名不能为空")
    private String username;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户角色 ADMIN | TEACHER | STUDENT
     */
    @NotNull(message = "用户角色不能为空")
    private UserRole role;
    /**
     * 学工编号
     */
    @NotBlank(message = "用户编号不能为空")
    private String number;
    /**
     * 班级 ID
     */
    @NotNull(message = "班级ID不能为空")
    private Long classId;
    /**
     * 用户性别
     */
    private String gender;
    /**
     * 用户手机号
     */
    private String phoneNumber;
    /**
     * 账号状态 是否禁用
     */
    private Boolean status;
}
