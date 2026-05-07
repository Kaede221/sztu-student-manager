package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studentmanager.common.OperationLog;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.score.CreateScoreRequest;
import com.studentmanager.dto.score.UpdateScoreRequest;
import com.studentmanager.model.MyEnrollment;
import com.studentmanager.model.MyScore;
import com.studentmanager.model.MyUser;
import com.studentmanager.service.EnrollmentService;
import com.studentmanager.service.ScoreService;
import com.studentmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "成绩管理")
@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreService scoreService;
    private final EnrollmentService enrollmentService;
    private final UserService userService;

    @OperationLog("录入成绩")
    @Operation(summary = "录入成绩")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PostMapping
    public RequestResult<String> insertScore(@Valid @RequestBody CreateScoreRequest createScoreRequest) {
        MyScore myScore = new MyScore();
        myScore.setEnrollmentId(createScoreRequest.getEnrollmentId());
        myScore.setScore(createScoreRequest.getScore());

        MyEnrollment enrollment = enrollmentService.getById(myScore.getEnrollmentId());
        if (enrollment == null) return RequestResult.error("选课记录不存在");

        MyScore score = scoreService.getOne(
                new LambdaQueryWrapper<MyScore>()
                        .eq(MyScore::getEnrollmentId, myScore.getEnrollmentId())
        );

        if (score != null) return RequestResult.error("该学生已有成绩");

        scoreService.save(myScore);
        return RequestResult.success("录入成功");
    }

    @OperationLog("修改成绩")
    @Operation(summary = "修改已录入的成绩")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @PutMapping
    public RequestResult<String> updateScore(@Valid @RequestBody UpdateScoreRequest updateScoreRequest) {
        MyScore score = new MyScore();
        score.setId(updateScoreRequest.getId());
        score.setScore(updateScoreRequest.getScore());

        boolean res = scoreService.updateById(score);
        return res ? RequestResult.success("修改成功") : RequestResult.error("修改失败");
    }

    @Operation(summary = "学生获取自己的所有成绩")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/my")
    public RequestResult<List<MyScore>> studentGetScore(Authentication authentication) {
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

    @Operation(summary = "根据课程ID，查询所有选了课的学生的成绩")
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
