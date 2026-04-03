package com.studentmanager.model;

import lombok.Data;

@Data
public class MyStudent {
    /**
     * 数据库唯一ID
     */
    private Long id;
    /**
     * 学号
     */
    private Long studentNumber;
    /**
     * 对应的 用户 ID
     */
    private Long userId;
    /**
     * 班级 ID
     */
    private Long classId;
    /**
     * 性别
     */
    private String gender;
    /**
     * 手机号
     */
    private String phoneNumber;
}
