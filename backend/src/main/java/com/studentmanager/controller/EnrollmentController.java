package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studentmanager.common.RequestResult;
import com.studentmanager.model.EnrollmentStatus;
import com.studentmanager.model.MyCourse;
import com.studentmanager.model.MyEnrollment;
import com.studentmanager.model.MyUser;
import com.studentmanager.service.CourseService;
import com.studentmanager.service.EnrollmentService;
import com.studentmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final CourseService courseService;
    private final UserService userService;

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @PostMapping("/enroll/{courseId}")
    public RequestResult<String> studentEnroll(@PathVariable Long courseId, Authentication authentication) {
        // 获取当前用户
        String username = authentication.getName();
        LambdaQueryWrapper<MyUser> myUserLambdaQueryWrapper = new LambdaQueryWrapper<>();
        myUserLambdaQueryWrapper.eq(MyUser::getUsername, username);
        MyUser user = userService.getOne(myUserLambdaQueryWrapper);

        // 判断课程是否存在
        MyCourse course = courseService.getById(courseId);
        if (course == null) {
            // 课程不存在
            return RequestResult.error("课程不存在，请重试：" + courseId);
        }

        // 判断自己是否选择该课程
        LambdaQueryWrapper<MyEnrollment> enrollmentLambdaQueryWrapper = new LambdaQueryWrapper<>();
        enrollmentLambdaQueryWrapper.eq(MyEnrollment::getStudentId, user.getId())
                .eq(MyEnrollment::getCourseId, courseId)
                .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED);
        MyEnrollment enrollment = enrollmentService.getOne(enrollmentLambdaQueryWrapper);
        if (enrollment != null) {
            return RequestResult.error("您已选择当前课程");
        }

        // 判断课程是否满了
        long count = enrollmentService.count(
                new LambdaQueryWrapper<MyEnrollment>()
                        .eq(MyEnrollment::getCourseId, courseId)
                        .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED)
        );
        if (count >= course.getCapacity()) {
            return RequestResult.error("课程已满");
        }

        // 成功了
        MyEnrollment myEnrollment = new MyEnrollment();
        myEnrollment.setStudentId(user.getId());
        myEnrollment.setCourseId(courseId);
        myEnrollment.setStatus(EnrollmentStatus.ENROLLED);
        enrollmentService.save(myEnrollment);

        return RequestResult.success("选课成功");
    }

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @PostMapping("/drop/{courseId}")
    public RequestResult<String> studentDrop(@PathVariable Long courseId, Authentication authentication) {
        // 获取当前用户
        String username = authentication.getName();
        MyUser user = userService.getOne(new LambdaQueryWrapper<MyUser>()
                .eq(MyUser::getUsername, username));

        // 找到选课记录
        MyEnrollment enrollment = enrollmentService.getOne(
                new LambdaQueryWrapper<MyEnrollment>()
                        .eq(MyEnrollment::getStudentId, user.getId())
                        .eq(MyEnrollment::getCourseId, courseId)
                        .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED)
        );

        if (enrollment == null) {
            return RequestResult.error("学生未选定当前课程");
        }

        // 退课
        enrollment.setStatus(EnrollmentStatus.DROPPED);
        boolean res = enrollmentService.updateById(enrollment);
        return res ? RequestResult.success("退课成功") : RequestResult.error("退课失败");
    }

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/my")
    public RequestResult<List<MyEnrollment>> getMyEnrollments(Authentication authentication) {
        // 获取当前用户
        MyUser user = userService.getOne(
                new LambdaQueryWrapper<MyUser>()
                        .eq(MyUser::getUsername, authentication.getName())
        );

        // 获取当前选中的课程
        List<MyEnrollment> enrollmentList = enrollmentService.list(
                new LambdaQueryWrapper<MyEnrollment>()
                        .eq(MyEnrollment::getStudentId, user.getId())
                        .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED)
        );

        return RequestResult.success(enrollmentList);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @GetMapping("/list/{courseId}")
    public RequestResult<List<MyEnrollment>> getEnrollmentPage(@PathVariable Long courseId) {
        return RequestResult.success(
                enrollmentService.list(
                        new LambdaQueryWrapper<MyEnrollment>()
                                .eq(MyEnrollment::getCourseId, courseId)
                )
        );
    }
}
