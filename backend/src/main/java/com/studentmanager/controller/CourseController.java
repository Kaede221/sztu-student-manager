package com.studentmanager.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.OperationLog;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.course.CreateCourseRequest;
import com.studentmanager.dto.course.UpdateCourseRequest;
import com.studentmanager.model.MyCourse;
import com.studentmanager.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "课程管理")
@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @Operation(summary = "分页查询课程列表")
    @GetMapping("/list")
    public RequestResult<Page<MyCourse>> getCourseListByPage(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        Page<MyCourse> coursePage = courseService.page(new Page<>(page, size));
        return RequestResult.success(coursePage);
    }

    @OperationLog("添加课程")
    @Operation(summary = "添加新课程")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PostMapping
    public RequestResult<String> addNewCourse(@Valid @RequestBody CreateCourseRequest createCourseRequest) {
        MyCourse course = new MyCourse();
        course.setCapacity(createCourseRequest.getCapacity());
        course.setCredit(createCourseRequest.getCredit());
        course.setDescription(createCourseRequest.getDescription());
        course.setName(createCourseRequest.getName());
        course.setTeacherId(createCourseRequest.getTeacherId());
        boolean res = courseService.save(course);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add course: " + createCourseRequest);
    }

    @OperationLog("修改课程")
    @Operation(summary = "修改现有课程")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PutMapping
    public RequestResult<String> editCourse(@Valid @RequestBody UpdateCourseRequest updateCourseRequest) {
        MyCourse course = new MyCourse();
        course.setId(updateCourseRequest.getId());
        course.setTeacherId(updateCourseRequest.getTeacherId());
        course.setName(updateCourseRequest.getName());
        course.setDescription(updateCourseRequest.getDescription());
        course.setCredit(updateCourseRequest.getCredit());
        course.setCapacity(updateCourseRequest.getCapacity());

        boolean res = courseService.updateById(course);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit course: " + course);
    }

    @OperationLog("删除课程")
    @Operation(summary = "根据ID删除课程")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteCourseById(@PathVariable Long id) {
        boolean res = courseService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on delete course: " + id);
    }
}
