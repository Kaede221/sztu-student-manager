package com.studentmanager.model;

import lombok.Data;

@Data
public class MyUser {
    /**
     * 唯一 ID
     */
    private Long id;
    /**
     * 用户名 唯一字段
     */
    private String username;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户角色 ADMIN | TEACHER | STUDENT
     */
    private UserRole role;
    /**
     * 账号状态 是否禁用
     */
    private boolean status;
}
