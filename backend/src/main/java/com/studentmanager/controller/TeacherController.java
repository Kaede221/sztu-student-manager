package com.studentmanager.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyTeacher;
import com.studentmanager.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @GetMapping("/list")
    public RequestResult<Page<MyTeacher>> getAllTeachers(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        Page<MyTeacher> teacherPage = teacherService.page(new Page<>(page, size));
        return RequestResult.success(teacherPage);
    }

    @GetMapping("/{id}")
    public RequestResult<MyTeacher> getTeacherById(@PathVariable Long id) {
        MyTeacher teacher = teacherService.getById(id);
        return teacher != null ? RequestResult.success(teacher) : RequestResult.error("Teacher is not found");
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping
    public RequestResult<String> addNewTeacher(@RequestBody MyTeacher teacher) {
        boolean res = teacherService.save(teacher);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add teacher: " + teacher.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editTeacher(@RequestBody MyTeacher teacher) {
        boolean res = teacherService.updateById(teacher);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit teacher: " + teacher.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteTeacherById(@PathVariable Long id) {
        boolean res = teacherService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on delete teacherId: " + id);
    }
}
