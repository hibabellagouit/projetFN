package com.deepedugraph.graphservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Component
public class WeeklyFeatureClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String,Object>> byStudent(Long studentId) {
        return restTemplate.getForObject(
                "http://localhost:8086/weekly-features/student/" + studentId,
                List.class
        );
    }
}

