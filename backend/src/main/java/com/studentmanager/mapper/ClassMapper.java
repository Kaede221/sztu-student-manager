package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyClass;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ClassMapper extends BaseMapper<MyClass> {
}
