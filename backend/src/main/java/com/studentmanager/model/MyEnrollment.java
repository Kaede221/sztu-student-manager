package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 选课记录
 */
@Data
@TableName("my_enrollment")
public class MyEnrollment {
    /**
     * 主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 学生ID
     */
    private Long studentId;
    /**
     * 课程ID
     */
    private Long courseId;
    /**
     * 状态
     */
    private EnrollmentStatus status;
}
