package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyEnrollment;
import com.studentmanager.model.MyScore;
import com.studentmanager.model.MyUser;
import com.studentmanager.service.EnrollmentService;
import com.studentmanager.service.ScoreService;
import com.studentmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreService scoreService;
    private final EnrollmentService enrollmentService;
    private final UserService userService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PostMapping
    public RequestResult<String> insertScore(@RequestBody MyScore score) {
        MyEnrollment enrollment = enrollmentService.getById(score.getEnrollmentId());
        if (enrollment == null) return RequestResult.error("选课记录不存在");

        MyScore myScore = scoreService.getOne(
                new LambdaQueryWrapper<MyScore>()
                        .eq(MyScore::getEnrollmentId, score.getEnrollmentId())
        );

        if (myScore != null) return RequestResult.error("该学生已有成绩");

        scoreService.save(score);
        return RequestResult.success("录入成功");
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PutMapping
    public RequestResult<String> updateScore(@RequestBody MyScore score) {
        boolean res = scoreService.updateById(score);
        return res ? RequestResult.success("修改成功") : RequestResult.error("修改失败");
    }

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/my")
    public RequestResult<List<MyScore>> stduentGetScore(Authentication authentication) {
        MyUser user = userService.getOne(
                new LambdaQueryWrapper<MyUser>()
                        .eq(MyUser::getUsername, authentication.getName())
        );

        // 首先，查询自己的选课记录
        List<MyEnrollment> enrollments = enrollmentService.list(
                new LambdaQueryWrapper<MyEnrollment>()
                        .eq(MyEnrollment::getStudentId, user.getId())
        );

        // 获取ID列表
        List<Long> enrollmentIds = enrollments.stream()
                .map(MyEnrollment::getId)
                .toList();

        // 判断是否为空
        if (enrollmentIds.isEmpty()) return RequestResult.success(List.of());

        // 查询成绩
        List<MyScore> scores = scoreService.list(
                new LambdaQueryWrapper<MyScore>()
                        .in(MyScore::getEnrollmentId, enrollmentIds)
        );

        return RequestResult.success(scores);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @GetMapping("/list/{courseId}")
    public RequestResult<List<MyScore>> getCourseScores(@PathVariable Long courseId) {
        // 首先获取选课记录
        List<MyEnrollment> enrollments = enrollmentService.list(
                new LambdaQueryWrapper<MyEnrollment>()
                        .eq(MyEnrollment::getCourseId, courseId)
        );

        // 获取ID
        List<Long> enrollmentIds = enrollments.stream().map(MyEnrollment::getId).toList();

        // 判断是否为空
        if (enrollmentIds.isEmpty()) return RequestResult.success(List.of());

        // 返回
        return RequestResult.success(scoreService.list(
                new LambdaQueryWrapper<MyScore>()
                        .in(MyScore::getEnrollmentId, enrollmentIds)
        ));
    }
}
