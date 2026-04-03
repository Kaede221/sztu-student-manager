package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
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
