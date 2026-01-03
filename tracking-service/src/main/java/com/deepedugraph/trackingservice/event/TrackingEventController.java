package com.deepedugraph.trackingservice.event;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/events")
public class TrackingEventController {

    private final TrackingEventRepository repository;

    public TrackingEventController(TrackingEventRepository repository) {
        this.repository = repository;
    }

    public record CreateTrackingEventRequest(
            @NotNull Long studentId,
            Long courseId,
            @NotBlank String eventType,
            String metadata
    ) {}

    @PostMapping
    public TrackingEvent create(@Valid @RequestBody CreateTrackingEventRequest request) {
        TrackingEvent event = TrackingEvent.builder()
                .studentId(request.studentId())
                .courseId(request.courseId())
                .eventType(request.eventType())
                .timestamp(Instant.now())
                .metadata(request.metadata())
                .build();
        return repository.save(event);
    }

    @GetMapping("/student/{studentId}")
    public List<TrackingEvent> byStudent(@PathVariable Long studentId) {
        return repository.findByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<TrackingEvent> byCourse(@PathVariable Long courseId) {
        return repository.findByCourseId(courseId);
    }
}

