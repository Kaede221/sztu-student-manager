package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("my_course")
public class MyCourse {
    /**
     * 唯一 ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    /**
     * 课程名称
     */
    private String name;
    /**
     * 学分
     */
    private Integer credit;
    /**
     * 授课教师 关联 user 表
     */
    private Long teacherId;
    /**
     * 课程容量
     */
    private Integer capacity;
    /**
     * 课程简介
     */
    private String description;
    /**
     * 是否被删除
     */
    @TableLogic
    private Integer deleted;
}
