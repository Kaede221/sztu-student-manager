package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyCourse;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseMapper extends BaseMapper<MyCourse> {
}
