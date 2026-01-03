package com.deepedugraph.featureservice.weekly;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/weekly-features")
public class WeeklyFeatureController {

    private final WeeklyFeatureService service;
    private final WeeklyFeatureRepository repository;

    public WeeklyFeatureController(WeeklyFeatureService service,
                                   WeeklyFeatureRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    public record AggregateRequest(
            @NotNull Long studentId,
            @NotNull Long courseId,
            @NotNull Integer week,
            int logins,
            int resourceViews,
            int submissions
    ) {}

    @PostMapping("/aggregate")
    public WeeklyFeature aggregate(@Valid @RequestBody AggregateRequest r) {
        return service.aggregate(
                r.studentId(),
                r.courseId(),
                r.week(),
                r.logins(),
                r.resourceViews(),
                r.submissions()
        );
    }

    @GetMapping("/student/{studentId}")
    public List<WeeklyFeature> byStudent(@PathVariable Long studentId) {
        return repository.findByStudentId(studentId);
    }
}

