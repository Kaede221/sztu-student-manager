package com.studentmanager.backend;

import com.studentmanager.mapper.UserMapper;
import com.studentmanager.model.MyUser;
import com.studentmanager.model.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {
    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        MyUser myUser = new MyUser();

        myUser.setUsername("kaedeshimizu");
        myUser.setRole(UserRole.ROLE_ADMIN);
        myUser.setPassword("123456");

        userMapper.insert(myUser);
    }

}
