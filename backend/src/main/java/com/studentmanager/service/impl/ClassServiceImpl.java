package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.ClassMapper;
import com.studentmanager.model.MyClass;
import com.studentmanager.service.ClassService;
import org.springframework.stereotype.Service;

@Service
public class ClassServiceImpl extends ServiceImpl<ClassMapper, MyClass> implements ClassService {
}
