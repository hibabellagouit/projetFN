package com.deepedugraph.featureservice.training;

import com.deepedugraph.featureservice.weekly.WeeklyFeature;
import com.deepedugraph.featureservice.weekly.WeeklyFeatureRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/weekly-features")
public class TrainingDataController {

    private final WeeklyFeatureRepository weeklyFeatureRepository;
    private final TrainingDataRepository trainingDataRepository;

    public TrainingDataController(WeeklyFeatureRepository weeklyFeatureRepository,
                                  TrainingDataRepository trainingDataRepository) {
        this.weeklyFeatureRepository = weeklyFeatureRepository;
        this.trainingDataRepository = trainingDataRepository;
    }

    @GetMapping("/training-data")
    public List<Map<String, Object>> getTrainingData() {
        List<TrainingData> trainingDataList = trainingDataRepository.findAll();
        List<WeeklyFeature> features = weeklyFeatureRepository.findAll();

        Map<String, TrainingData> trainingMap = trainingDataList.stream()
                .collect(Collectors.toMap(
                        td -> td.getStudentId() + "-" + td.getCourseId() + "-" + td.getWeek(),
                        td -> td
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        for (WeeklyFeature feature : features) {
            String key = feature.getStudentId() + "-" + feature.getCourseId() + "-" + feature.getWeek();
            TrainingData trainingData = trainingMap.get(key);
            if (trainingData != null && feature.getTotalEvents() != null) {
                Map<String, Object> data = new java.util.HashMap<>();
                data.put("studentId", feature.getStudentId());
                data.put("courseId", feature.getCourseId());
                data.put("week", feature.getWeek());
                data.put("totalEvents", feature.getTotalEvents());
                data.put("logins", feature.getLogins() != null ? feature.getLogins() : 0);
                data.put("resourceViews", feature.getResourceViews() != null ? feature.getResourceViews() : 0);
                data.put("submissions", feature.getSubmissions() != null ? feature.getSubmissions() : 0);
                data.put("label", trainingData.getLabel());
                result.add(data);
            }
        }
        return result;
    }
}

