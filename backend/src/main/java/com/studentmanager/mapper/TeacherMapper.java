package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyTeacher;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TeacherMapper extends BaseMapper<MyTeacher> {
}
