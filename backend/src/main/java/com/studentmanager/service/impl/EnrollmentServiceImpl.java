package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.EnrollmentMapper;
import com.studentmanager.model.MyEnrollment;
import com.studentmanager.service.EnrollmentService;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentServiceImpl extends ServiceImpl<EnrollmentMapper, MyEnrollment> implements EnrollmentService {
}
