package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyStudent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper extends BaseMapper<MyStudent> {
}
