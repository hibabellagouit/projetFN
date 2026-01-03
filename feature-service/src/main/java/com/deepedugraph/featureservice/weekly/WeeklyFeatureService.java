package com.deepedugraph.featureservice.weekly;

import com.deepedugraph.featureservice.training.TrainingData;
import com.deepedugraph.featureservice.training.TrainingDataRepository;
import org.springframework.stereotype.Service;

@Service
public class WeeklyFeatureService {

    private final WeeklyFeatureRepository repository;
    private final TrainingDataRepository trainingDataRepository;

    public WeeklyFeatureService(WeeklyFeatureRepository repository,
                                 TrainingDataRepository trainingDataRepository) {
        this.repository = repository;
        this.trainingDataRepository = trainingDataRepository;
    }

    public WeeklyFeature aggregate(Long studentId, Long courseId, Integer week,
                                   int logins, int views, int submissions) {

        WeeklyFeature wf = repository
                .findByStudentIdAndCourseIdAndWeek(studentId, courseId, week)
                .orElse(WeeklyFeature.builder()
                        .studentId(studentId)
                        .courseId(courseId)
                        .week(week)
                        .build());

        wf.setLogins(logins);
        wf.setResourceViews(views);
        wf.setSubmissions(submissions);
        wf.setTotalEvents(logins + views + submissions);

        return repository.save(wf);
    }

    public WeeklyFeature saveRaw(Long studentId, Long courseId, Integer week,
                                 Integer totalEvents, Integer logins,
                                 Integer resourceViews, Integer submissions, Integer label) {
        WeeklyFeature wf = repository
                .findByStudentIdAndCourseIdAndWeek(studentId, courseId, week)
                .orElse(WeeklyFeature.builder()
                        .studentId(studentId)
                        .courseId(courseId)
                        .week(week)
                        .build());

        wf.setTotalEvents(totalEvents);
        wf.setLogins(logins);
        wf.setResourceViews(resourceViews);
        wf.setSubmissions(submissions);

        repository.save(wf);

        TrainingData trainingData = trainingDataRepository
                .findByStudentIdAndCourseIdAndWeek(studentId, courseId, week)
                .orElse(TrainingData.builder()
                        .studentId(studentId)
                        .courseId(courseId)
                        .week(week)
                        .build());

        trainingData.setLabel(label);
        trainingDataRepository.save(trainingData);

        return wf;
    }
}

