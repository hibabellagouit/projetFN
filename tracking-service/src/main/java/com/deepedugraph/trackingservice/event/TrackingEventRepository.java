package com.deepedugraph.trackingservice.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByStudentId(Long studentId);
    List<TrackingEvent> findByCourseId(Long courseId);
    List<TrackingEvent> findByTimestampBetween(Instant start, Instant end);
}


