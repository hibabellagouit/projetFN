package com.deepedugraph.featureservice.training;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainingDataRepository extends JpaRepository<TrainingData, Long> {
    List<TrainingData> findAll();
    Optional<TrainingData> findByStudentIdAndCourseIdAndWeek(Long studentId, Long courseId, Integer week);
}

