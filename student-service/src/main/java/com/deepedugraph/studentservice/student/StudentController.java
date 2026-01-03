package com.deepedugraph.studentservice.student;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    public record CreateStudentRequest(
            @NotBlank String fullName,
            @NotBlank String cohort
    ) {}

    @GetMapping
    public List<Student> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Student create(@Valid @RequestBody CreateStudentRequest request) {
        Student student = Student.builder()
                .fullName(request.fullName())
                .cohort(request.cohort())
                .build();
        return repository.save(student);
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }
}


