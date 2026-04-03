package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("my_student")
public class MyStudent {
    /**
     * 数据库唯一ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 学号
     */
    private String studentNumber;
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
