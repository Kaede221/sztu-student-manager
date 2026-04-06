package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.OperationMapper;
import com.studentmanager.model.MyOperationLog;
import com.studentmanager.service.OperationLogService;
import org.springframework.stereotype.Service;

@Service
public class OperationLogServiceImpl extends ServiceImpl<OperationMapper, MyOperationLog> implements OperationLogService {
}
