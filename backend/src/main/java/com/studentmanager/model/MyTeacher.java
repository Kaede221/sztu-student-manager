package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("my_teacher")
public class MyTeacher {
    /**
     * 数据库唯一ID
     */
    @TableId(type = IdType.AUTO)
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
