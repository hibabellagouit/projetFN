package com.deepedugraph.featureservice.weekly;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface WeeklyFeatureRepository extends JpaRepository<WeeklyFeature, Long> {
    Optional<WeeklyFeature> findByStudentIdAndCourseIdAndWeek(Long studentId, Long courseId, Integer week);
    List<WeeklyFeature> findByStudentId(Long studentId);
}

