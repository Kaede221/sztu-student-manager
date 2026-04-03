package com.studentmanager.controller;

import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyTeacher;
import com.studentmanager.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @GetMapping("/list")
    public RequestResult<List<MyTeacher>> getAllTeachers() {
        return RequestResult.success(teacherService.list());
    }

    @GetMapping("/{id}")
    public RequestResult<MyTeacher> getTeacherById(@PathVariable Long id) {
        MyTeacher teacher = teacherService.getById(id);
        return teacher != null ? RequestResult.success(teacher) : RequestResult.error("Teacher is not found");
    }

    @PostMapping
    public RequestResult<String> addNewTeacher(@RequestBody MyTeacher teacher) {
        boolean res = teacherService.save(teacher);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add teacher: " + teacher.toString());
    }

    @PutMapping
    public RequestResult<String> editTeacher(@RequestBody MyTeacher teacher) {
        boolean res = teacherService.updateById(teacher);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit teacher: " + teacher.toString());
    }

    @DeleteMapping("/{id}")
    public RequestResult<String> deleteTeacherById(@PathVariable Long id) {
        boolean res = teacherService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on delete teacherId: " + id);
    }
}
