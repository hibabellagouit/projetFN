package com.deepedugraph.courseservice.course;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseRepository repository;

    public CourseController(CourseRepository repository) {
        this.repository = repository;
    }

    public record CreateCourseRequest(
            @NotBlank String title,
            @NotBlank String semester
    ) {}

    @GetMapping
    public List<Course> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Course create(@Valid @RequestBody CreateCourseRequest request) {
        Course course = Course.builder()
                .title(request.title())
                .semester(request.semester())
                .build();
        return repository.save(course);
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }
}


