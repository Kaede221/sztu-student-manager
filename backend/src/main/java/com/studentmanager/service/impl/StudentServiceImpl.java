package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.StudentMapper;
import com.studentmanager.model.MyStudent;
import com.studentmanager.service.StudentService;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, MyStudent> implements StudentService {
}
