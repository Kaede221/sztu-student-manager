package com.studentmanager.controller;

import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyStudent;
import com.studentmanager.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @GetMapping("/list")
    public RequestResult<List<MyStudent>> getAllStudents() {
        return RequestResult.success(studentService.list());
    }

    @GetMapping("/{id}")
    public RequestResult<MyStudent> getStudentById(@PathVariable Long id) {
        MyStudent student = studentService.getById(id);
        return student != null ? RequestResult.success(student) : RequestResult.error("Student is not found");
    }

    @PostMapping
    public RequestResult<String> addNewStudent(@RequestBody MyStudent student) {
        boolean res = studentService.save(student);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add student: " + student.toString());
    }

    @PutMapping
    public RequestResult<String> editStudent(@RequestBody MyStudent student) {
        boolean res = studentService.updateById(student);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit student: " + student.toString());
    }

    @DeleteMapping("/{id}")
    public RequestResult<String> deleteStudentById(@PathVariable Long id) {
        boolean res = studentService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on delete studentId: " + id);
    }
}
