package com.deepedugraph.graphservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Component
public class AiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Double predictRisk(List<Map<String,Object>> features) {
        Map<String,Object> body = Map.of("features", features);
        Map<String,Object> response = restTemplate.postForObject(
                "http://localhost:8090/predict",
                body,
                Map.class
        );
        return ((Number) response.get("risk")).doubleValue();
    }
}

