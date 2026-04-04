package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@TableName("my_user")
public class MyUser {
    /**
     * 唯一 ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 用户名 唯一字段
     */
    private String username;
    /**
     * 用户密码
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    /**
     * 用户角色 ADMIN | TEACHER | STUDENT
     */
    private UserRole role;
    /**
     * 学工编号
     */
    private String number;
    /**
     * 班级 ID
     */
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
