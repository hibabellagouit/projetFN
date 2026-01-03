package com.deepedugraph.enrollmentservice.enrollment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository repository;

    public EnrollmentController(EnrollmentRepository repository) {
        this.repository = repository;
    }

    public record CreateEnrollmentRequest(
            @NotNull Long studentId,
            @NotNull Long courseId
    ) {}

    @GetMapping
    public List<Enrollment> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Enrollment create(@Valid @RequestBody CreateEnrollmentRequest request) {
        Enrollment enrollment = Enrollment.builder()
                .studentId(request.studentId())
                .courseId(request.courseId())
                .enrolledAt(Instant.now())
                .build();
        return repository.save(enrollment);
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> byStudent(@PathVariable Long studentId) {
        return repository.findByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Enrollment> byCourse(@PathVariable Long courseId) {
        return repository.findByCourseId(courseId);
    }
}

