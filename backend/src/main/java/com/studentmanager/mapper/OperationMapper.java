package com.studentmanager.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studentmanager.model.MyOperationLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OperationMapper extends BaseMapper<MyOperationLog> {
}
