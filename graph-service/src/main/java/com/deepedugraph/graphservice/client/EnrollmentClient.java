package com.deepedugraph.graphservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import java.util.List;
import java.util.Collections;
import java.util.Map;

@Component
public class EnrollmentClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String,Object>> byStudent(Long studentId) {
        try {
            List result = restTemplate.getForObject(
                    "http://localhost:8085/enrollments/student/" + studentId,
                    List.class
            );
            return result != null ? result : Collections.emptyList();
        } catch (RestClientException e) {
            return Collections.emptyList();
        }
    }
}

