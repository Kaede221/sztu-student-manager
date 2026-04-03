package com.studentmanager.model;

import lombok.Data;

@Data
public class MyTeacher {
    /**
     * 数据库唯一ID
     */
    private Long id;
    /**
     * 教师编号
     */
    private String teacherNumber;
    /**
     * 对应的用户ID
     */
    private Long userId;
}
