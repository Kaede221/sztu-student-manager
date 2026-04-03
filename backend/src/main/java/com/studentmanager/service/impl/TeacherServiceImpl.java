package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.TeacherMapper;
import com.studentmanager.model.MyTeacher;
import com.studentmanager.service.TeacherService;
import org.springframework.stereotype.Service;

@Service
public class TeacherServiceImpl extends ServiceImpl<TeacherMapper, MyTeacher> implements TeacherService {
}
