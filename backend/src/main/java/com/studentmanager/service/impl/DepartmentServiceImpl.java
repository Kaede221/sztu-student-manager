package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.DepartmentMapper;
import com.studentmanager.model.MyDepartment;
import com.studentmanager.service.DepartmentService;
import org.springframework.stereotype.Service;

@Service
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, MyDepartment> implements DepartmentService {
}
