package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyDepartment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DepartmentMapper extends BaseMapper<MyDepartment> {
}
