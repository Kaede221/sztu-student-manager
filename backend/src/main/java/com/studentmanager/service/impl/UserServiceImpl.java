package com.studentmanager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studentmanager.mapper.UserMapper;
import com.studentmanager.model.MyUser;
import com.studentmanager.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, MyUser> implements UserService {
}
